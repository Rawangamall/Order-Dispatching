const axios = require('axios');
const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/DriverModel");

const orderSchema = mongoose.model("order");
const driverSchema = mongoose.model("driver");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

exports.allOrder = catchAsync(async (request, response, next) => {
    const driverID = request.headers.driver_id

    const orders = await orderSchema.find({ DriverID: driverID, Status: { $in: ["delivered", "cancelled"] } }).sort({ createdAt: -1 })
	const totalOrders = orders.length;

    response.status(200).json({ orders, totalOrders });
});

exports.assignOrder = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id
    const orders = await orderSchema.find({DriverID:driverID , Status:"assign"}).sort({ createdAt: -1 })

    const totalOrders = orders.length;

    response.status(200).json({orders , totalOrders});

});

exports.pickedOrder = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id
    const orders = await orderSchema.find({DriverID:driverID , Status:"picked"}).sort({ createdAt: -1 })
	const totalOrders = orders.length;

    response.status(200).json({orders , totalOrders});

});

exports.pickAction = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id;
    const orderID = request.params._id;


    const order = await orderSchema.findOne({_id: orderID, Status: "assign"});
    const driver = await driverSchema.findOne({_id: driverID});

    
    if (order && driver && (driver._id == order.DriverID)) {

        if (driver.orderCount < 2)
         {
              order.Status = "picked";

              await order.save();
              order.changeOrderStatus(order._id,order.Status)

              driver.orderCount += 1;
         }
         if (driver.orderCount >= 2) {
                driver.availability = "busy";
         }

         await driver.save();
         response.status(200).json({message: "Order picked"});

    }else{
        return next(new AppError(`That order is no longer available`, 404));
    }

});


exports.deliverAction = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id;
    const orderID = request.params._id;

    const driver = await driverSchema.findOne({_id: driverID});
    const order = await orderSchema.findOne({_id: orderID, Status: "picked"});

    if (order && driver && (driver._id == order.DriverID)){
         const before = order.updatedAt

        order.Status = "delivered";
        await order.save();
        order.changeOrderStatus(order._id,order.Status)

        const after = order.updatedAt
        const diff = after - before;

        const differenceInSeconds = Math.floor(diff / 1000);
        const minutes = Math.floor((differenceInSeconds % 3600) / 60);

        order.updated_status = minutes
        await order.save();



            driver.orderCount -= 1;

            if (driver.orderCount < 2) {
                driver.availability = "free";
            }

            await driver.save();

    }else{
        return next(new AppError(`That order is no longar available`, 404));
    }

    // For E-commerce
  //  await axios.post(`http://e-commerce.nader-mo.tech/dispatch/orders/${order._id}/complete`);

    response.status(200).json({message: "Order delivered"});
});

exports.cancelAction = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id;
    const orderID = request.params._id;

    const order = await orderSchema.findOne({_id: orderID, Status: "picked"});
    const driver = await driverSchema.findOne({_id: driverID});

    if (order && driver && (driver._id == order.DriverID)){

        order.Status = "cancelled";
        await order.save();
        order.changeOrderStatus(order._id,order.Status)

            driver.orderCount -= 1;

            if ( driver.orderCount < 2) {
                driver.availability = "free";
            }

            await driver.save();

    }else{
        return next(new AppError(`That order is no longar available`, 404));
    }

    // For E-commerce
 //   await axios.post(`http://e-commerce.nader-mo.tech/dispatch/orders/${order._id}/cancel`);

    response.status(200).json({message: "Order cancelled"});
});

exports.cancelAssign = catchAsync(async (request, response, next) => {
    const orderID = request.params._id;

    const order = await orderSchema.findOne({_id: orderID, Status: "assign"});
``
    if (order) {

        order.Status = "reassigned";
        order.DriverID = undefined;
        await order.save();
        order.changeOrderStatus(order._id,order.Status)

    }else{
        return next(new AppError(`That order is no longar available`, 404));
    }

    response.status(200).json({message: "Order reassigned"});

})

exports.getDriverById = (request, response, next) => {

    driverSchema.findById(request.params._id)
      .then((data) => {
        response.status(200).json(data);
      })
      .catch((error) => {
        next(error);
      });
  };
