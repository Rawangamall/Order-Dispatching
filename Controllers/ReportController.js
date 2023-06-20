const mongoose = require("mongoose");
require("./../Models/OrderModel");
require("./../Models/DriverModel");

const OrderSchema = mongoose.model("order");
const DriverSchema = mongoose.model("driver");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

exports.finalReport = catchAsync(async (request, response, next) => {

	const data = await OrderSchema.aggregate([
	  { $match:{ Status: "delivered" } },
	  {
		$group: {
		  _id: "$DriverID",
		  count: { $sum: 1 },
		  totalTime: { $sum: { $toLong: "$updated_status" } },
		},
	  },
	  {
		$lookup: {
		  from: "drivers",
		  localField: "_id",
		  foreignField: "_id",
		  as: "driver",
		},
	  },
	  {
		$unwind: "$driver",
	  },
	  {
		$project: {
		  _id: 0,
		  driverID: "$_id",
		  driverName: "$driver.driverName",
		  count: 1,
		  averageTime: {
			$dateToString: {
			  date: {
				$toDate: {
				  $multiply: [
					{ $divide: ["$totalTime", "$count"] },
					1000 * 60 ,
				  ],
				},
			  },
			  format: "%H:%M:%S",
			},
		  },
		},
	  },
	]);
  
	
	response.status(200).json(data);
  });
  
