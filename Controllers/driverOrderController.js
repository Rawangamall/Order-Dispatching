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

