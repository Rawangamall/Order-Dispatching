const mongoose = require("mongoose");
require("./../Models/OrderModel");

const OrderSchema = mongoose.model("order");

exports.getAllCustomers = (request, response, next) => {
	const searchKey = request.headers.searchkey?.toLowerCase() || "";
	const showNum = request.headers.shownum || null;
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
		{
			$match: {
				$or: [
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{ Address: { $regex: searchKey, $options: "i" } },
				],
			},
		},
		{ $limit: parseInt(showNum) || 7
		}
	])
		.then((data) => {
			response.status(200).json(data);
		})
		.catch((error) => {
			next(error);
		});
};



exports.getCustomerById = (request, response, next) => {
	const id = request.params._id;
	OrderSchema.aggregate([
		{
			$group: {
				_id: "$CustomerID",
				CustomerName: { $first: "$CustomerName" },
				CustomerEmail: { $first: "$CustomerEmail" },
				Address: { $first: "$Address" },
			},
		},
		{ $match: { _id: id } },
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
}