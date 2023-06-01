const mongoose=require("mongoose");
require("./../Models/OrderModel")
const orderSchema = mongoose.model("order");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

exports.getAll = catchAsync(async (req, res, next) => {
  const searchKey = req.body.searchKey?.toLowerCase() || "";
  const status = req.body.status || "";
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
          { CustomerEmail: { $regex: searchKey ,$options: "i" } },
          { "Address.Governate": { $regex: searchKey, $options: "i" } },
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
    query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
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
          { CustomerEmail: { $regex: searchKey ,$options: "i" } },
          { "Address.Governate": { $regex: searchKey, $options: "i" } },
          { "Address.City": { $regex: searchKey, $options: "i" } },
          { "Address.Area": { $regex: searchKey, $options: "i" } },
          { PaymentMethod: { $regex: searchKey, $options: "i" } },
          { Status: { $regex: searchKey, $options: "i" } },
        ],
      },
      {Status : "assign"}
    ],
  };

  if (governate !== "") {
    query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
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
          { CustomerEmail: { $regex: searchKey ,$options: "i" } },
          { "Address.Governate": { $regex: searchKey, $options: "i" } },
          { "Address.City": { $regex: searchKey, $options: "i" } },
          { "Address.Area": { $regex: searchKey, $options: "i" } },
          { PaymentMethod: { $regex: searchKey, $options: "i" } },
          { Status: { $regex: searchKey, $options: "i" } },
        ],
      },
      {Status : "reassigned"}
    ],
  };

  if (governate !== "") {
    query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
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
          { CustomerEmail: { $regex: searchKey ,$options: "i" } },
          { "Address.Governate": { $regex: searchKey, $options: "i" } },
          { "Address.City": { $regex: searchKey, $options: "i" } },
          { "Address.Area": { $regex: searchKey, $options: "i" } },
          { PaymentMethod: { $regex: searchKey, $options: "i" } },
          { Status: { $regex: searchKey, $options: "i" } },
        ],
      },
      {Status : "picked"}
    ],
  };

  if (governate !== "") {
    query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
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
          { CustomerEmail: { $regex: searchKey ,$options: "i" } },
          { "Address.Governate": { $regex: searchKey, $options: "i" } },
          { "Address.City": { $regex: searchKey, $options: "i" } },
          { "Address.Area": { $regex: searchKey, $options: "i" } },
          { PaymentMethod: { $regex: searchKey, $options: "i" } },
          { Status: { $regex: searchKey, $options: "i" } },
        ],
      },
      {Status : "cancelled"}
    ],
  };

  if (governate !== "") {
    query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
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
          { CustomerEmail: { $regex: searchKey ,$options: "i" } },
          { "Address.Governate": { $regex: searchKey, $options: "i" } },
          { "Address.City": { $regex: searchKey, $options: "i" } },
          { "Address.Area": { $regex: searchKey, $options: "i" } },
          { PaymentMethod: { $regex: searchKey, $options: "i" } },
          { Status: { $regex: searchKey, $options: "i" } },
        ],
      },
      {Status : "delivered"}
    ],
  };

  if (governate !== "") {
    query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
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
          { CustomerEmail: { $regex: searchKey ,$options: "i" } },
          { "Address.Governate": { $regex: searchKey, $options: "i" } },
          { "Address.City": { $regex: searchKey, $options: "i" } },
          { "Address.Area": { $regex: searchKey, $options: "i" } },
          { PaymentMethod: { $regex: searchKey, $options: "i" } },
          { Status: { $regex: searchKey, $options: "i" } },
        ],
      },
      {Status : "confirm"}
    ],
  };

  if (governate !== "") {
    query.$and.push({ "Address.Governate": { $regex: governate, $options: "i" } });
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
