const baseURL = process.env.BASE_URL || 'http://localhost:8080';
const socket = require('socket.io-client')(`${baseURL}`);
const axios = require('axios');
const mongoose = require('mongoose');
require("./Models/OrderModel");
const orderSchema = mongoose.model("order");

module.exports = function(io) {

		socket.on("newOrder", async (orderData) => {
        try {
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
          const data = await order.save();
          console.log('Order saved:', data);

          // Send a request to orderController.getall()
          const response = await axios.get(`${baseURL}/orders`);
          console.log('Orders retrieved:', response.data);

          // Send a request to dispatchController.assignOrder()
          const res = await axios.get(`${baseURL}/dispatch/${data._id}`);
          console.log(res.data);
        } catch (error) {
          console.error('Error saving order:', error);
        }
	});


};