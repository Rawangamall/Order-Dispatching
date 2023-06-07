const socket = require('socket.io-client')('http://localhost:8080');
const mongoose = require('mongoose');
require("./Models/OrderModel");

const orderSchema = mongoose.model("order");

// Connect to the database
mongoose.set('strictQuery', true);  //warning

mongoose.connect('mongodb+srv://OrderDispatching:iti@cluster0.eesrbrh.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log("DB connected");
    
    // Listen for the 'connect' event
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Listen for the 'newOrder' event
    socket.on('newOrder', async (orderData) => {
        console.log("out try",orderData)
      try {
        console.log("inside try", orderData);
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
      } catch (error) {
        console.error('Error saving order:', error);
      }
    });
  })
  .catch(error => {
    console.log("Db Problem " + error);
  });
