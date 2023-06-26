const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/LocationModel");
require("./../Models/DriverModel");

let Pusher = require('pusher');
const pusher = new Pusher({
	appId: "1621334",
	key: "bec24d45349a2eb1b439",
	secret: "377d841d412c45d14065",
	cluster: "eu",
	useTLS: true
  });

const orderSchema = mongoose.model("order");
const governateSchema = mongoose.model("Governate");
const driverSchema = mongoose.model("driver");``

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

  if (governate == "" || governate == null) {

    return next(new AppError("Governate not found", 401));
  }

  const city = governate.cities.find((c) => c.name === cityName);
  if (!city) {
    return next(new AppError("City not found", 401));
  }

  const area = city.areas.find((a) => a.name === areaName);
  if (area == "" || area == null) {
    return next(new AppError("Area not found", 401));
  }

  const driver = await driverSchema
    .findOne({
      areas: area._id,
      availability: "free",
    }).sort({ orderCount: 1 }).limit(1);

    console.log(driver);

   if (driver) {

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

    // Trigger the notification event for the specific driver
   const assignOrdersCount = await orderSchema.countDocuments({ DriverID: driver._id, Status: "assign" });
   pusher.trigger(`driver-${driver._id}`, 'new-order', assignOrdersCount);
    
   }
   else {
  //  if all driver is busy we will reassign the order
    await orderSchema.updateOne(
      { _id: order._id },
      {
        $set: {
          Status: "reassigned",
        },
      }
    );
    console.log(order.Status);
  }

});


const scheduleReAssignedOrder = () => {
  const updateAssignedOrders = async () => {
    try {
      console.log('select reassigned orders...');
      const reassignedOrderIds = await orderSchema.find({ Status: 'reassigned'},{_id:1});
      // console.log("array res: ",reassignedOrderIds);

      reassignedOrderIds.forEach(async (order_id) => {
        // console.log("reassigned orderss: ",order_id);
         exports.assignOrder({ params: { _id:order_id } });
      });

    } catch (error) {
      console.error('Error updating orders:', error);
    }
  };

  updateAssignedOrders();
  setInterval(updateAssignedOrders, 1 * 60 * 1000);
};

scheduleReAssignedOrder();



    