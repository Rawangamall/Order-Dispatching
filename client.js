const socket = require('socket.io-client')('http://localhost:8080');
const axios = require('axios');
const mongoose = require('mongoose');

require("./Models/OrderModel");
const orderSchema = mongoose.model("order");
require("./Routes/DispatchRoute");

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

        const data = await order.save();
      //  console.log('Order saved:', data);

      // Send a request to orderController.getall()
      console.log(data._id)

      const response = await axios.get("http://localhost:8080/orders");
      console.log('Orders retrieved:', response.data);

     const res = await axios.get(`http://localhost:8080/dispatch/${data._id}`);
     console.log('AreaId:', res.data);
  
     } catch (error) {
      console.error('Error saving order:', error);
    }


    });
  })
  .catch(error => {
    console.log("Db Problem " + error);
  });
