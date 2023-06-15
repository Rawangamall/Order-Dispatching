const mongoose = require("mongoose");
require("./../Models/OrderModel");
const orderSchema = mongoose.model("order");

const catchAsync = require("./../utils/CatchAsync");

exports.allOrder = catchAsync(async (req, res) => {
    const totalOrders = await orderSchema.countDocuments();
    res.status(200).json(totalOrders);
})

exports.allAssignOrder = catchAsync(async (req, res) => {
    const OrdersCount = await orderSchema.countDocuments({ Status: 'assign' });
    res.status(200).json(OrdersCount);
  });

  exports.allReassignOrder = catchAsync(async (req, res) => {
    const OrdersCount = await orderSchema.countDocuments({ Status: 'reassigned' });
    res.status(200).json(OrdersCount);
  });

  exports.allPickedOrder = catchAsync(async (req, res) => {
    const OrdersCount = await orderSchema.countDocuments({ Status: 'picked' });
    res.status(200).json(OrdersCount);
  });
  exports.allDeliveredOrder = catchAsync(async (req, res) => {
    const OrdersCount = await orderSchema.countDocuments({ Status: 'delivered' });
    res.status(200).json(OrdersCount);
  });
  exports.allCancelledOrder = catchAsync(async (req, res) => {
    const OrdersCount = await orderSchema.countDocuments({ Status: 'cancelled' });
    res.status(200).json(OrdersCount);
  });

  exports.allNewOrder = catchAsync(async (req, res) => {
    const OrdersCount = await orderSchema.countDocuments({ Status: 'confirm' });
    res.status(200).json(OrdersCount);
  });

 