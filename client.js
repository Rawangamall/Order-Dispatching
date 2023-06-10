const socket = require('socket.io-client')('http://localhost:8080');
const axios = require('axios');
const mongoose = require('mongoose');
require("./Models/OrderModel");
const orderSchema = mongoose.model("order");


const baseURL = process.env.BASE_URL || 'http://localhost:8080';


// Connect to the database
mongoose.set("strictQuery", true); //warning

mongoose
	.connect(
		"mongodb+srv://OrderDispatching:iti@cluster0.eesrbrh.mongodb.net/?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("DB connected");

		socket.on("connect", () => {
			console.log("Connected to the server");
		});

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
      //  console.log('Order saved:', data);

      // Send a request to orderController.getall()
      const response = await axios.get(`${baseURL}/orders`);
      console.log('Orders retrieved:', response.data);

	  // Send a request to dispatchController.assignOrder()
     const res = await axios.get(`${baseURL}/dispatch/${data._id}`);
     console.log('DriverID:', res.data);
  
     } catch (error) {
      console.error('Error saving order:', error);
    }


    });
  })
  .catch(error => {
    console.log("Db Problem " + error);
  });
