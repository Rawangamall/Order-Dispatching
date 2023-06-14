const mongoose = require("mongoose");
require("./../Models/OrderModel");

const OrderSchema = mongoose.model("order");

exports.getAllCustomers = (request, response, next) => {
	OrderSchema.find({} , 'CustomerID CustomerName CustomerEmail  Address -_id')
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};
