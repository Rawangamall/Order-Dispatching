const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/DriverModel");

const OrderSchema = mongoose.model("order");
const DrvierSchema = mongoose.model("driver");

exports.finalReport = (request, response, next) => {
	OrderSchema.aggregate([
		{ $match: { DriverID: { $ne: null }, Status: "delivered" } },
		{
			$group: {
				_id: "$DriverID",
				count: { $sum: 1 },
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
