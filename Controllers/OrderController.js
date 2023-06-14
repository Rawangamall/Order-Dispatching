const mongoose = require("mongoose");
require("./../Models/OrderModel");
const orderSchema = mongoose.model("order");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");
const { io } = require("./../utils/socket");

exports.recieveOrder = catchAsync(async (req, res) => {
  const orderData = req.body;

  // Emit the "newOrder" event with the order data
  console.log("Emitting newOrder event");
  io.emit("newOrder", orderData);

  res.status(200).json({
    status: orderData,
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
  
	const data = await orderSchema.find(query).limit(limit);
 	const totalOrders = await orderSchema.countDocuments(); // Retrieve total number of orders from the entire database
 
	if (data.length === 0) {

		res.status(200).json({message : "There's no data"}); 
		
	}
	
	 res.status(200).json({ data, totalOrders }); 	

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
	const searchKey = req.headers.searchkey || "";
	const city = req.headers.city || "";
	const governate = req.headers.governate || "";
  
	const query = {
	  Status: "assign",
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
