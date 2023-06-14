const mongoose = require("mongoose");
require("./../Models/OrderModel");
const orderSchema = mongoose.model("order");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");
const { io } = require("./../utils/socket")

exports.recieveOrder = catchAsync (async (req, res) => {

    	const orderData = req.body;
		
		// Emit the "newOrder" event with the order data
		console.log("Emitting newOrder event");
		io.emit("newOrder", orderData);

		res.status(200).json({
			status: orderData

		});
		
});

exports.saveOrder = catchAsync(async (req, res) => {
	const orderData = req.body;
	console.log(orderData);
  
	const products = orderData.Product.map((product) => {
	  return {
		ItemCode: product.ItemCode,
		ItemName: product.ItemName,
		Price: product.Price,
		Quantity: product.Quantity,
	  };
	});
  
	const order = new orderSchema({
	  _id: orderData._id,
	  CustomerID: orderData.CustomerID,
	  CustomerName: orderData.CustomerName,
	  CustomerEmail: orderData.CustomerEmail,
	  Address: {
		Area: orderData.Address.Area,
		City: orderData.Address.City,
		Governate: orderData.Address.Governate,
	  },
	  Product: products,
	  PaymentMethod: orderData.PaymentMethod,
	  Status: orderData.Status,
	  TotalPrice: orderData.TotalPrice,
	});
  
	try {
	  await order.save();
	  res.status(200).json({ message: "Order saved" });
	} catch (error) {
	  if (error.code === 11000) {
		res.status(400).json({ error: "Duplicate key error" });
	  } else {
		res.status(500).json({ error: "Error saving in database" });
	  }
	}
  });
  
  


exports.getAll = catchAsync(async (req, res, next) => {
	//search
	const searchKey = req.body.searchKey || "";

	//filteration
	const status = req.body.status || "";
	const city = req.body.city || "";
	const governate = req.body.governate || "";
	const orderNum = req.body.orderNum || null;

	let objectId = "";
	if (mongoose.Types.ObjectId.isValid(searchKey)) {
		objectId = mongoose.Types.ObjectId(searchKey);
	}

	const query = {
		$and: [
			{
				$or: [
					{ _id: { $regex: objectId, $options: "i" } },
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{
						"Address.Governate": {
							$regex: searchKey,
							$options: "i",
						},
					},
					{ "Address.City": { $regex: searchKey, $options: "i" } },
					{ "Address.Area": { $regex: searchKey, $options: "i" } },
					{ PaymentMethod: { $regex: searchKey, $options: "i" } },
					{ Status: { $regex: searchKey, $options: "i" } },
				],
			},
		],
	};

	if (status !== "") {
		query.$and.push({ Status: { $regex: status, $options: "i" } });
	}

	if (governate !== "") {
		query.$and.push({
			"Address.Governate": { $regex: governate, $options: "i" },
		});
	}

	if (city !== "") {
		query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}

	let limit = null;
	if (orderNum !== null) {
		limit = parseInt(orderNum);
	}

	const data = await orderSchema.find(query).limit(limit);

	if (data.length === 0) {
		return next(new AppError("There's no data", 401));
	}

	res.status(200).json({ data });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
	if (!req.body.Status) {
		next(new AppError("Please enter the new Status to change!", 404));
	}

	const orderId = req.params._id;

	if (!mongoose.Types.ObjectId.isValid(orderId)) {
		next(new AppError("Invalid order ID!", 400));
	}

	await orderSchema.updateOne(
		{
			_id: orderId,
		},
		{
			$set: {
				Status: req.body.Status,
			},
		}
	);

	res.status(200).json({ message: "Updated!" });
});

exports.getoneOrder = catchAsync(async (req, res, next) => {
	const orderId = req.params._id;
	if (!mongoose.Types.ObjectId.isValid(orderId)) {
		next(new AppError("Invalid order ID!", 400));
	}

	const data = await orderSchema.findOne({ _id: orderId });
	if (!data) {
		return next(new AppError("There's no data", 401));
	}
	res.status(200).json(data);
});

//manual order

// exports.addorder = async (request, response, next) => {
//   try {

//    const products = request.body.Product.map((product) => {
//   return {
//     ItemCode: product.ItemCode,
//     ItemName: product.ItemName,
//     Price: product.Price,
//     Quantity: product.Quantity
//   };
// });

// const order = new orderSchema({
//   _id: request.body._id,
//   CustomerID: request.body.CustomerID,
//   CustomerName: request.body.CustomerName,
//   CustomerEmail: request.body.CustomerEmail,
//   Address: {
//     Area: request.body.Address.Area,
//     City: request.body.Address.City,
//     Governate: request.body.Address.Governate
//   },
//   Product: products,
//   PaymentMethod: request.body.PaymentMethod,
//   Status: request.body.Status,
//   TotalPrice: request.body.TotalPrice
// });

//     const data = await order.save();
//     response.status(201).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

exports.getAssignedOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.body.searchKey?.toLowerCase() || "";
	const city = req.body.city || "";
	const governate = req.body.governate || "";

	let objectId = "";
	if (mongoose.Types.ObjectId.isValid(searchKey)) {
		objectId = mongoose.Types.ObjectId(searchKey);
	}

	const query = {
		$and: [
			{
				$or: [
					{ _id: { $eq: objectId } },
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{
						"Address.Governate": {
							$regex: searchKey,
							$options: "i",
						},
					},
					{ "Address.City": { $regex: searchKey, $options: "i" } },
					{ "Address.Area": { $regex: searchKey, $options: "i" } },
					{ PaymentMethod: { $regex: searchKey, $options: "i" } },
				],
			},
			{ Status: "assign" },
		],
	};

	if (governate !== "") {
		query.$and.push({
			"Address.Governate": { $regex: governate, $options: "i" },
		});
	}

	if (city !== "") {
		query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}

	const data = await orderSchema.find(query);

	if (data.length === 0) {
		return next(new AppError("There's no data", 401));
	}

	res.status(200).json({ data });
});

exports.getReassignedOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.body.searchKey?.toLowerCase() || "";
	const city = req.body.city || "";
	const governate = req.body.governate || "";

	let objectId = "";
	if (mongoose.Types.ObjectId.isValid(searchKey)) {
		objectId = mongoose.Types.ObjectId(searchKey);
	}

	const query = {
		$and: [
			{
				$or: [
					{ _id: { $eq: objectId } },
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{
						"Address.Governate": {
							$regex: searchKey,
							$options: "i",
						},
					},
					{ "Address.City": { $regex: searchKey, $options: "i" } },
					{ "Address.Area": { $regex: searchKey, $options: "i" } },
					{ PaymentMethod: { $regex: searchKey, $options: "i" } },
				],
			},
			{ Status: "reassigned" },
		],
	};

	if (governate !== "") {
		query.$and.push({
			"Address.Governate": { $regex: governate, $options: "i" },
		});
	}

	if (city !== "") {
		query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}

	const data = await orderSchema.find(query);

	if (data.length === 0) {
		return next(new AppError("There's no data", 401));
	}

	res.status(200).json({ data });
});

exports.getPickedOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.body.searchKey?.toLowerCase() || "";
	const city = req.body.city || "";
	const governate = req.body.governate || "";

	let objectId = "";
	if (mongoose.Types.ObjectId.isValid(searchKey)) {
		objectId = mongoose.Types.ObjectId(searchKey);
	}

	const query = {
		$and: [
			{
				$or: [
					{ _id: { $eq: objectId } },
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{
						"Address.Governate": {
							$regex: searchKey,
							$options: "i",
						},
					},
					{ "Address.City": { $regex: searchKey, $options: "i" } },
					{ "Address.Area": { $regex: searchKey, $options: "i" } },
					{ PaymentMethod: { $regex: searchKey, $options: "i" } },
				],
			},
			{ Status: "picked" },
		],
	};

	if (governate !== "") {
		query.$and.push({
			"Address.Governate": { $regex: governate, $options: "i" },
		});
	}

	if (city !== "") {
		query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}

	const data = await orderSchema.find(query);

	if (data.length === 0) {
		return next(new AppError("There's no data", 401));
	}

	res.status(200).json({ data });
});

exports.getCancelledOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.body.searchKey?.toLowerCase() || "";
	const city = req.body.city || "";
	const governate = req.body.governate || "";

	let objectId = "";
	if (mongoose.Types.ObjectId.isValid(searchKey)) {
		objectId = mongoose.Types.ObjectId(searchKey);
	}

	const query = {
		$and: [
			{
				$or: [
					{ _id: { $eq: objectId } },
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{
						"Address.Governate": {
							$regex: searchKey,
							$options: "i",
						},
					},
					{ "Address.City": { $regex: searchKey, $options: "i" } },
					{ "Address.Area": { $regex: searchKey, $options: "i" } },
					{ PaymentMethod: { $regex: searchKey, $options: "i" } },
				],
			},
			{ Status: "cancelled" },
		],
	};

	if (governate !== "") {
		query.$and.push({
			"Address.Governate": { $regex: governate, $options: "i" },
		});
	}

	if (city !== "") {
		query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}

	const data = await orderSchema.find(query);

	if (data.length === 0) {
		return next(new AppError("There's no data", 401));
	}

	res.status(200).json({ data });
});

exports.getDeliveredOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.body.searchKey?.toLowerCase() || "";
	const city = req.body.city || "";
	const governate = req.body.governate || "";

	let objectId = "";
	if (mongoose.Types.ObjectId.isValid(searchKey)) {
		objectId = mongoose.Types.ObjectId(searchKey);
	}

	const query = {
		$and: [
			{
				$or: [
					{ _id: { $eq: objectId } },
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{
						"Address.Governate": {
							$regex: searchKey,
							$options: "i",
						},
					},
					{ "Address.City": { $regex: searchKey, $options: "i" } },
					{ "Address.Area": { $regex: searchKey, $options: "i" } },
					{ PaymentMethod: { $regex: searchKey, $options: "i" } },
				],
			},
			{ Status: "delivered" },
		],
	};

	if (governate !== "") {
		query.$and.push({
			"Address.Governate": { $regex: governate, $options: "i" },
		});
	}

	if (city !== "") {
		query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}

	const data = await orderSchema.find(query);

	if (data.length === 0) {
		return next(new AppError("There's no data", 401));
	}

	res.status(200).json({ data });
});

exports.getNewOrdersOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.body.searchKey?.toLowerCase() || "";
	const city = req.body.city || "";
	const governate = req.body.governate || "";

	let objectId = "";
	if (mongoose.Types.ObjectId.isValid(searchKey)) {
		objectId = mongoose.Types.ObjectId(searchKey);
	}

	const query = {
		$and: [
			{
				$or: [
					{ _id: { $eq: objectId } },
					{ CustomerName: { $regex: searchKey, $options: "i" } },
					{ CustomerEmail: { $regex: searchKey, $options: "i" } },
					{
						"Address.Governate": {
							$regex: searchKey,
							$options: "i",
						},
					},
					{ "Address.City": { $regex: searchKey, $options: "i" } },
					{ "Address.Area": { $regex: searchKey, $options: "i" } },
					{ PaymentMethod: { $regex: searchKey, $options: "i" } },
				],
			},
			{ Status: "confirm" },
		],
	};

	if (governate !== "") {
		query.$and.push({
			"Address.Governate": { $regex: governate, $options: "i" },
		});
	}

	if (city !== "") {
		query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}

	const data = await orderSchema.find(query);

	if (data.length === 0) {
		return next(new AppError("There's no data", 401));
	}

	res.status(200).json({ data });
});
