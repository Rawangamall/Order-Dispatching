const baseURL = process.env.BASE_URL || 'http://localhost:8080';
const socket = require('socket.io-client')(`${baseURL}`);
const axios = require('axios');

console.log("in client out of socket ")
socket.on("newOrder", async (orderData) => {
  try {
    console.log("in client in socket ")
    console.log(orderData)

    // Send a request to orderController.saveOrder()
    await axios.post(`${baseURL}/orders/save`, orderData);

    // Send a request to orderController.getall()
    const response = await axios.get(`${baseURL}/orders`);
    console.log('Orders retrieved:', response.data);

    // Send a request to dispatchController.assignOrder()
     await axios.get(`${baseURL}/dispatch/${orderData._id}`);

    } catch (error) {
    console.error("Error:", error);
  }
});
