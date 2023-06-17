const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/LocationModel");
require("./../Models/DriverModel");

const orderSchema = mongoose.model("order");
const governateSchema = mongoose.model("Governate");
const driverSchema = mongoose.model("driver");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

exports.allOrder = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id

    const orders = await orderSchema.find({DriverID:driverID})
	const totalOrders = await orderSchema.countDocuments();

    response.status(200).json({orders , totalOrders});

});

exports.assignOrder = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id

    const orders = await orderSchema.find({DriverID:driverID , Status:"assign"})
	const totalOrders = await orderSchema.countDocuments();

    response.status(200).json({orders , totalOrders});

});

exports.pickedOrder = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id

    const orders = await orderSchema.find({DriverID:driverID , Status:"picked"})
	const totalOrders = await orderSchema.countDocuments();

    response.status(200).json({orders , totalOrders});

});

exports.cancelledOrder = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id

    const orders = await orderSchema.find({DriverID:driverID , Status:"cancelled"})
	const totalOrders = await orderSchema.countDocuments();

    response.status(200).json({orders , totalOrders});

});

exports.pickAction = catchAsync(async (request, response, next) => {

    const driverID = request.headers.driver_id;
    const orderID = request.params._id;

    const order = await orderSchema.findOne({_id: orderID, Status: "assign"});

    if (order) {
        order.Status = "picked";
        await order.save();

        const driver = await driverSchema.findOne({DriverID: driverID});

        if (driver) {
            driver.orderCount += 1;

            if (driver.orderCount == 2) {
                driver.availability = "busy";
            }

            await driver.save();
        }
    }else{
        return next(new AppError("That order is no longar available"),400)
    }

    response.status(200).json({message: "Order picked"});
});
