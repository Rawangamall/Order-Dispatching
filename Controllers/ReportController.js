const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/DriverModel");

const OrderSchema = mongoose.model("order");
const DriverSchema = mongoose.model("driver");

exports.finalReport = (request, response, next) => {
	OrderSchema.aggregate([
		{
			$match: {
				Status: "delivered"
			}
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
			$unwind: "$driver",
		},
		{
			$group: {
				_id: "$DriverID",
				driverName: { $first: "$driver.driverName" },
				driverEmail: { $first: "$driver.email" },
				orders: {
					$push: {

					},
				},
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
