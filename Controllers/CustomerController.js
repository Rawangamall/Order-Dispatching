const mongoose = require("mongoose");
require("./../Models/OrderModel");

const OrderSchema = mongoose.model("order");

exports.getAllCustomers = (request, response, next) => {
	OrderSchema.aggregate([
		{
			$group: {
				_id: "$CustomerID",
				CustomerName: { $first: "$CustomerName" },
				CustomerEmail: { $first: "$CustomerEmail" },
				Address: { $first: "$Address" },
			},
		},
		{ $match: { _id: { $ne: null } } },
		{
			$project: {
				_id: 0,
				CustomerID: "$_id",
				CustomerName: 1,
				CustomerEmail: 1,
				Address: 1,
			},
		},
	])
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};
