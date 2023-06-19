const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/DriverModel");

const OrderSchema = mongoose.model("order");
const DrvierSchema = mongoose.model("driver");

exports.finalReport = (request, response, next) => {
	OrderSchema.find({})
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};
