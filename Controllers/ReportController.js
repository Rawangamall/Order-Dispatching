const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/DriverModel");

const OrderSchema = mongoose.model("order");
const DriverSchema = mongoose.model("driver");

exports.finalReport = (request, response, next) => {
	OrderSchema.aggregate([
		{ $match: { Status: "delivered" } },
		{
			$group: {
				_id: "$DriverID",
				count: { $sum: 1 },
			},
		},
		{
			$lookup: {
				from: "drivers",
				localField: "DriverID",
				foreignField: "_id",
				as: "driver",
			},
		},
		{
			$project: {
				_id: 0,
				driverID: "$_id",
				driverName: { $arrayElemAt: ["$driver.driverName", 0] },
				count: 1,
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
