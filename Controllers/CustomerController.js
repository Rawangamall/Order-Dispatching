const mongoose = require("mongoose");
require("./../Models/OrderModel");

const OrderSchema = mongoose.model("order");

exports.getAllCustomers = async(request, response, next) => {
	const searchKey = request.headers.searchkey?.toLowerCase() || "";
	const showNum = request.headers.shownum || null;
	const totalCunstomers = await OrderSchema.aggregate([
		{
		  $group: {
			_id: "$CustomerID",
		  },
		},
		{
		  $group: {
			_id: null,
			totalCustomers: { $sum: 1 },
		  },
		},
		{
			$project: {
					_id: 0,
					totalCustomers: 1,
				},
		}
	  ]);
	
	  const total = totalCunstomers[0].totalCustomers;
	  
console.log(totalCunstomers[0].totalCustomers);
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
			response.json({ data, total });
			
		})
		.catch((error) => {
			next(error);
		});
};


exports.getCustomerById = (request, response, next) => {
	const id = mongoose.Types.ObjectId(request.params.id); 
  
	console.log(id);
	OrderSchema.aggregate([
	  {
		$match: { CustomerID: id } // Match documents with the specified CustomerID
	  },
	  {
		$group: {
		  _id: "$CustomerID",
		  CustomerName: { $first: "$CustomerName" },
		  CustomerEmail: { $first: "$CustomerEmail" },
		  Address: { $first: "$Address" },
		  Orders: { $push: "$$ROOT" } // Collect all orders for the customer
		}
	  },
	  {
		$project: {
		  _id: 0,
		  CustomerID: "$_id",
		  CustomerName: 1,
		  CustomerEmail: 1,
		  Address: 1,
		  Orders: 1
		}
	  }
	])
	  .then((data) => {
		response.status(200).json(data);
	  })
	  .catch((error) => {
		next(error);
	  });
  }
  