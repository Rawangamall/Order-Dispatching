const mongoose = require("mongoose");
require("./../Models/OrderModel");

const OrderSchema = mongoose.model("order");

exports.getAllProducts = (request, response, next) => {
	OrderSchema.find({}, "Product -_id")
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};
