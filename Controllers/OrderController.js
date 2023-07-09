const mongoose = require("mongoose");
const moment = require('moment');

require("./../Models/OrderModel");
require("./../Models/DriverModel");
require("./../Models/LocationModel");

const orderSchema = mongoose.model("order");
const governateSchema = mongoose.model("Governate");
const driverSchema = mongoose.model("driver");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");


const Pusher = require('pusher');

const pusher = new Pusher({
	appId: "1621334",
	key: "bec24d45349a2eb1b439",
	secret: "377d841d412c45d14065",
	cluster: "eu",
	useTLS: true
  });
  
exports.recieveOrder = catchAsync(async (req, res , next) => {
  const orderData = req.body;

  const governateName = orderData.Address.Governate;
  const cityName = orderData.Address.City;
  const areaName = orderData.Address.Area;

  const governate = await governateSchema.findOne({ governate: governateName });

  if (!governate) {
    return next(new AppError("Governate not found", 401));
  }

  const city = governate.cities.find((c) => c.name === cityName);
  if (!city) {
	return next(new AppError("City not found", 401));
  }

  const area = city.areas.find((a) => a.name === areaName);
  if (!area) {
   return next(new AppError("Area not found", 401));
  }

  try {
    // Trigger the newOrder event on the "orders" channel
    await pusher.trigger('orders', 'newOrder', orderData);

    res.status(200).json({
      status: orderData,
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to trigger Pusher event',
    });
  }
});


exports.saveOrder = catchAsync(async (req, res , next) => {
  const orderData = req.body;

  const products = orderData.Product.map((product) => {
    return {
      product_id: product.product_id,
      name_en: product.name_en,
      price: product.price,
      quantity: product.quantity,
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
	order.changeOrderStatus(order._id,order.Status)
    res.status(200).json({ message: "Order saved" });

  } catch (error) {
 res.status(400).json({ error: "Error saving in database" });
  }

});

exports.getAll = catchAsync(async (req, res, next) => {
	// Search
	const searchKey = req.headers.searchkey || "";
  
	// Filteration
	const status = req.headers.status || "";
	const city = req.headers.city || "";
	const governate = req.headers.governate || "";
	const orderNum = req.headers.ordernum || null;
  
	let query = {};
  
	if (searchKey) {
	  const objectId = mongoose.Types.ObjectId.isValid(searchKey)
		? mongoose.Types.ObjectId(searchKey)
		: null;
  
	  const regexSearchKey = new RegExp(searchKey, "i");
  
	  query = {
		$or: [
		  { _id: objectId },
		  { CustomerName: regexSearchKey },
		  { CustomerEmail: regexSearchKey },
		  { "Address.Governate": regexSearchKey },
		  { "Address.City": regexSearchKey },
		  { "Address.Area": regexSearchKey },
		  { PaymentMethod: regexSearchKey },
		  { Status: regexSearchKey },
		],
	  };
	}
  
	if (status) {
	  query["Status"] = new RegExp(status, "i");
	}
  
	if (governate) {
	  query["Address.Governate"] = new RegExp(governate, "i");
	}
  
	if (city) {
	  query["Address.City"] = new RegExp(city, "i");
	}
  
	let limit = null;
	if (orderNum !== null) {
	  limit = parseInt(orderNum);
	}
  
	const data = await orderSchema.find(query).sort({ createdAt: -1 }).limit(limit);
  
	// Filter the orders by confirmed status
	const confirmedOrders = data.filter(order => order.Status === 'confirm');
  
	const matchedDrivers = await Promise.all(confirmedOrders.map(async (order) => {
	  const governateName = order.Address.Governate;
	  const cityName = order.Address.City;
	  const areaName = order.Address.Area;
  
	  const governate = await governateSchema.findOne({ governate: governateName });
  
	  if (!governate) {
         return next(new AppError("Governate not found", 401));
	  }
  
	  const city = governate.cities.find((c) => c.name === cityName);
	  if (!city) {
		throw new AppError("City not found", 401);
	  }
  
	  const area = city.areas.find((a) => a.name === areaName);
	  if (!area) {
		throw new AppError("Area not found", 401);
	  }
  
	  const drivers = await driverSchema
		.find({
		  areas: area._id,
		  availability: "free",
		})
		.sort({ orderCount: 1 }).select("_id driverName");
  
	  return { order, drivers };
	}));
  
	// Add matchedDrivers to each order in the data 
	const updatedData = data.map((order) => {
	  const matchedDriverObj = matchedDrivers.find((md) => md.order._id.equals(order._id));
	  if (matchedDriverObj) {
		return {
		  ...order._doc,
		  matchedDrivers: matchedDriverObj.drivers,
		};
	  }
	  return order;
	});
  

	const totalOrders = await orderSchema.countDocuments(); // Retrieve total number of orders from the entire database
  
	res.status(200).json({ data: updatedData, totalOrders });
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


exports.getAssignedOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.headers.searchkey || "";
	const city = req.headers.city || "";
	const governate = req.headers.governate || "";
  let query = { Status: "assign"}
  if (searchKey) {
	const objectId = mongoose.Types.ObjectId.isValid(searchKey)
	  ? mongoose.Types.ObjectId(searchKey)
	  : null;

	 query = {
		...query,
	  $and: [
		{
		  $or: [
			{ _id: objectId },
			{ CustomerName: { $regex: searchKey, $options: "i" } },
			{ CustomerEmail: { $regex: searchKey, $options: "i" } },
			{ "Address.Governate": { $regex: searchKey, $options: "i" } },
			{ "Address.City": { $regex: searchKey, $options: "i" } },
			{ "Address.Area": { $regex: searchKey, $options: "i" } },
			{ PaymentMethod: { $regex: searchKey, $options: "i" } },
		  ],
		},
	  ],
	};
}
	if (governate !== "") {
	  query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
	}
  
	if (city !== "") {
	  query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}
  
	const totalOrders = await orderSchema.countDocuments();
	const data = await orderSchema.find(query);
  
	if (data.length === 0) {
	  return res.status(200).json({ message: "There's no data" });
	}
  
	res.status(200).json({ data, totalOrders });
  });
  
  
  

exports.getReassignedOrders = catchAsync(async (req, res, next) => {

const searchKey = req.headers.searchkey || "";
const city = req.headers.city || "";
const governate = req.headers.governate || "";

const query = {
  Status: "reassigned",
  $and: [
	{
	  $or: [
		{ _id: mongoose.Types.ObjectId.isValid(searchKey) ? mongoose.Types.ObjectId(searchKey) : null },
		{ CustomerName: { $regex: searchKey, $options: "i" } },
		{ CustomerEmail: { $regex: searchKey, $options: "i" } },
		{ "Address.Governate": { $regex: searchKey, $options: "i" } },
		{ "Address.City": { $regex: searchKey, $options: "i" } },
		{ "Address.Area": { $regex: searchKey, $options: "i" } },
		{ PaymentMethod: { $regex: searchKey, $options: "i" } },
	  ],
	},
  ],
};

if (governate !== "") {
  query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
}

if (city !== "") {
  query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
}

const totalOrders = await orderSchema.countDocuments();
const data = await orderSchema.find(query);

if (data.length === 0) {
  return res.status(200).json({ message: "There's no data" });
}

res.status(200).json({ data, totalOrders });
});

exports.getPickedOrders = catchAsync(async (req, res, next) => {

	const searchKey = req.headers.searchkey || "";
	const city = req.headers.city || "";
	const governate = req.headers.governate || "";
	
	const query = {
	  Status: "picked",
	  $and: [
		{
		  $or: [
			{ _id: mongoose.Types.ObjectId.isValid(searchKey) ? mongoose.Types.ObjectId(searchKey) : null },
			{ CustomerName: { $regex: searchKey, $options: "i" } },
			{ CustomerEmail: { $regex: searchKey, $options: "i" } },
			{ "Address.Governate": { $regex: searchKey, $options: "i" } },
			{ "Address.City": { $regex: searchKey, $options: "i" } },
			{ "Address.Area": { $regex: searchKey, $options: "i" } },
			{ PaymentMethod: { $regex: searchKey, $options: "i" } },
		  ],
		},
	  ],
	};
	
	if (governate !== "") {
	  query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
	}
	
	if (city !== "") {
	  query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}
	
	const totalOrders = await orderSchema.countDocuments();
	const data = await orderSchema.find(query);
	
	if (data.length === 0) {
	  return res.status(200).json({ message: "There's no data" });
	}
	
	res.status(200).json({ data, totalOrders });
});

exports.getCancelledOrders = catchAsync(async (req, res, next) => {
	const searchKey = req.headers.searchkey || "";
	const city = req.headers.city || "";
	const governate = req.headers.governate || "";
	
	const query = {
	  Status: "cancelled",
	  $and: [
		{
		  $or: [
			{ _id: mongoose.Types.ObjectId.isValid(searchKey) ? mongoose.Types.ObjectId(searchKey) : null },
			{ CustomerName: { $regex: searchKey, $options: "i" } },
			{ CustomerEmail: { $regex: searchKey, $options: "i" } },
			{ "Address.Governate": { $regex: searchKey, $options: "i" } },
			{ "Address.City": { $regex: searchKey, $options: "i" } },
			{ "Address.Area": { $regex: searchKey, $options: "i" } },
			{ PaymentMethod: { $regex: searchKey, $options: "i" } },
		  ],
		},
	  ],
	};
	
	if (governate !== "") {
	  query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
	}
	
	if (city !== "") {
	  query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}
	
	const totalOrders = await orderSchema.countDocuments();
	const data = await orderSchema.find(query);
	
	if (data.length === 0) {
	  return res.status(200).json({ message: "There's no data" });
	}
	
	res.status(200).json({ data, totalOrders });
});

exports.getDeliveredOrders = catchAsync(async (req, res, next) => {

	const searchKey = req.headers.searchkey || "";
	const city = req.headers.city || "";
	const governate = req.headers.governate || "";
	
	const query = {
	  Status: "delivered",
	  $and: [
		{
		  $or: [
			{ _id: mongoose.Types.ObjectId.isValid(searchKey) ? mongoose.Types.ObjectId(searchKey) : null },
			{ CustomerName: { $regex: searchKey, $options: "i" } },
			{ CustomerEmail: { $regex: searchKey, $options: "i" } },
			{ "Address.Governate": { $regex: searchKey, $options: "i" } },
			{ "Address.City": { $regex: searchKey, $options: "i" } },
			{ "Address.Area": { $regex: searchKey, $options: "i" } },
			{ PaymentMethod: { $regex: searchKey, $options: "i" } },
		  ],
		},
	  ],
	};
	
	if (governate !== "") {
	  query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
	}
	
	if (city !== "") {
	  query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}
	
	const totalOrders = await orderSchema.countDocuments();
	const data = await orderSchema.find(query);
	
	if (data.length === 0) {
	  return res.status(200).json({ message: "There's no data" });
	}
	
	res.status(200).json({ data, totalOrders });
});

exports.getNewOrdersOrders = catchAsync(async (req, res, next) => {

	const searchKey = req.headers.searchkey || "";
	const city = req.headers.city || "";
	const governate = req.headers.governate || "";
	
	const query = {
	  Status: "confirm",
	  $and: [
		{
		  $or: [
			{ _id: mongoose.Types.ObjectId.isValid(searchKey) ? mongoose.Types.ObjectId(searchKey) : null },
			{ CustomerName: { $regex: searchKey, $options: "i" } },
			{ CustomerEmail: { $regex: searchKey, $options: "i" } },
			{ "Address.Governate": { $regex: searchKey, $options: "i" } },
			{ "Address.City": { $regex: searchKey, $options: "i" } },
			{ "Address.Area": { $regex: searchKey, $options: "i" } },
			{ PaymentMethod: { $regex: searchKey, $options: "i" } },
		  ],
		},
	  ],
	};
	
	if (governate !== "") {
	  query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
	}
	
	if (city !== "") {
	  query.$and.push({ "Address.City": { $regex: city, $options: "i" } });
	}
	
	const totalOrders = await orderSchema.countDocuments();
	const data = await orderSchema.find(query);
	
	if (data.length === 0) {
	  return res.status(200).json({ message: "There's no data" });
	}
	
	res.status(200).json({ data, totalOrders });
});

exports.getAllStatus = catchAsync(async (req, res, next) => {
	const statuses = await orderSchema.distinct('Status');
	res.status(200).json(statuses);
  });

exports.statuslogs = catchAsync(async (req, res, next) => {
	const orders = await orderSchema.find().select('_id statusLogs');
  
	const data = orders.map(order => {
	  const formattedLogs = order.statusLogs.map(log => {
		return {
		  Status: log.Status,
		  Time: moment(log.Time).format('YYYY MMMM Do, h:mm a')
		};
	  });
  
	  return {
		_id: order._id,
		statusLogs: formattedLogs
	  };
	});
  
	res.status(200).json(data);
});
  