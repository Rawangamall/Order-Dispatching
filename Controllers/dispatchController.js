const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/LocationModel");
require("./../Models/DriverModel");

const orderSchema = mongoose.model("order");
const governateSchema = mongoose.model("Governate");
const driverSchema = mongoose.model("driver");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

// search by location name and return with area id for driver search
exports.assignOrder = catchAsync(async (request, response, next) => {
  const id = request.params._id;

  const order = await orderSchema.findById(id);

  const governateName = order.Address.Governate;
  const cityName = order.Address.City;
  const areaName = order.Address.Area;

  const governate = await governateSchema.findOne({ governate: governateName });

  if (!governate) {
    return next(new AppError("Governate not found", 401));
  }

  const city = governate.cities.find((c) => c.name === cityName);
  if (!city) {
    return next(new AppError("City not found", 401));
  }

  const area = city.areas.find((a) => a.name === areaName);
  if (!area) {
    return next(new AppError("Area not found", 401));
  }

  const driver = await driverSchema
    .findOne({
      areas: area._id,
      availability: "free",
    })
    .limit(1);

  console.log(area._id);
  if (driver) {
    // Update the driver's availability to 'busy'
    if (driver.orderCount == 1) {
      driver.orderCount = 2;
      driver.availability = "busy";
    } else {
      driver.orderCount += 1;
    }
    await driver.save();

    //assign order to the specific driver
    await orderSchema.updateOne(
      { _id: order._id },
      {
        $set: {
          DriverID: driver._id,
          Status: "assign",
          updated_status: Date.now() + 10 * 60 * 1000
        },
      }
    );
  } else {
    //if all driver is busy we will reassign the order
    await orderSchema.updateOne(
      { _id: order._id },
      {
        $set: {
          Status: "reassigned",
        },
      }
    );
  }

  // response.status(200).json({ message: "success" });
});


// exports.ReAssignedOrder = async (request, response, next) => {
//   try {
//     console.log('Updating orders...');

//     const filteredOrders = await orderSchema.find({
//       status: 'assign',
//       updated_status: { $lt: new Date(Date.now()).toISOString() },
//     });

//     // ...
// console.log(response)
//     // Send a response back to the client
//     response.status(200).json({ message: 'Orders updated successfully' });
//     console.log('Orders updated successfully:', filteredOrders);
//   } catch (error) {
//     console.error('Error updating orders:', error);
//     // Send an error response back to the client
//     response.status(500).json({ error: 'An error occurred' });
//   }
// };


// // Schedule the task to run every 5 minutes (adjust the interval as needed)
// setInterval(() => exports.ReAssignedOrder(request, response, next), 1 * 60 * 200);



const scheduleReAssignedOrder = () => {

  const checkAndUpdateOrders = async () => {
    try {
      console.log('Updating orders...');

      const filteredOrders = await orderSchema.find({
        status: 'assign',
        updated_status: { $lt: new Date(Date.now()).toISOString() },
      });

      await order.save();

      filteredOrders.forEach(async (order) => {
        order.status = 'reassigned';
        order.DriverID = undefined;

        driver = await driverSchema.findById(order.DriverID);
        driver.orderCount -= 1;
        if (driver.orderCount == 0) {
          driver.availability = 'free';
        }
        
        await driver.save();
       
      });
  
      filteredOrders.forEach(async (order) => {
        await exports.assignOrder({ params: { _id: order._id } });
      });

      console.log('Orders updated successfully:', filteredOrders);
    } catch (error) {
      console.error('Error updating orders:', error);
    }
  };


  checkAndUpdateOrders();


  setInterval(checkAndUpdateOrders, 5 * 60 * 1000);
};


scheduleReAssignedOrder();
