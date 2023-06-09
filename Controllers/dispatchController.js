const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/LocationModel");
require("./../Models/DriverModel");

const orderSchema = mongoose.model("order");
const governateSchema=mongoose.model("Governate");
const driverSchema=mongoose.model("driver");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");




// search by location name and return with area id for driver search
exports.assignOrder = async (request, response, next) => {
    
       const id = request.params._id

       const order = await orderSchema.findById(id)

      const governateName = order.Address.Governate
      const cityName = order.Address.City
      const areaName = order.Address.Area
        console.log(governateName)
    try {
      const governate = await governateSchema.findOne({ governate: governateName });
      console.log(governate)

      if (!governate) {
        return next(new AppError("Governate not found", 401));
      }
  
      const city = governate.cities.find(c => c.name === cityName);
      if (!city) {
        return next(new AppError("City not found", 401));
      }
  
      const area = city.areas.find(a => a.name === areaName);
      if (!area) {
        return next(new AppError("Area not found", 401));
      }

      const driver = await DriverSchema.findOne({ areas: area._id, availability: 'free' }).limit(1);
  
      if (driver) {
        // Update the driver's availability to 'busy'
        if(driver.orderCount==1)
        {
          driver.orderCount=2;
          driver.availability = 'busy';
        }
        await driver.save();
    }
  
      response.json({ driver: driver._id });
    } catch (error) {
      next(error);
    }
  };

  // exports.getDriversToBeAssignedOrderTo = async (request, response, next) => {
  //   try {
  //       const areaId = request.params.id;
  
  //     // Find one driver with the specified area_id and availability
  //     const driver = await DriverSchema.findOne({ areas: areaId, availability: 'free' }).limit(1);
  
  //     if (driver) {
  //       // Update the driver's availability to 'busy'
  //       if(driver.orderCount==1)
  //       {
  //         driver.orderCount=2;
  //         driver.availability = 'busy';
  //       }
        
       
  //       await driver.save();
  
  //       // Assign the driver_id in the order data
  //       const orderId = request.body.orderId;
  //       const order = await OrderSchema.findById(orderId);
  //       order.DriverID = driver._id;
  //       await order.save();
  
  //       // Return the driver data
  //       response.json(driver);
  //     } else {
  //       response.json({ message: 'No available drivers found' });
  //     }
  //   } catch (error) {
  //     next(error);
  //   }
  // };