const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var bodyParser = require("body-parser");
require("dotenv").config({ path: "config.env" });

const UserRoute = require("./Routes/UserRoute");
const RoleRoute = require("./Routes/RoleRoute");
const DriverRoute = require("./Routes/DriverRoute");
const loginRoute = require("./Routes/loginRoute");
const OrderRoute = require("./Routes/OrderRoute");
const locationRoute = require("./Routes/LocationRoute");
const DispatchRoute = require("./Routes/DispatchRoute");
const CustomersRoute = require("./Routes/CustomerRoute");
const ProductsRoute = require("./Routes/ProductsRoute");
const statisticsRoute = require("./Routes/statisticsRoute");

const refresh = require("./github_refresh/refresh");
const client = require("./client");
const socketIO = require("socket.io");
const { io, server, app } = require("./utils/socket");
//server

let port = process.env.PORT || 8080;

//db connection
mongoose.set("strictQuery", true); //warning

mongoose
  .connect(
    "mongodb+srv://OrderDispatching:iti@cluster0.eesrbrh.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB connected");
    server.listen(port, () => {
      console.log("server is listenng.....", port);
    });
  })
  .catch((error) => {
    console.log("Db Problem " + error);
  });

app.use(
  cors({
    origin: "*",
  })
);
//body parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use("/refresh", refresh);
app.use(loginRoute);
app.use(RoleRoute);
app.use(UserRoute);
app.use(OrderRoute);
app.use(statisticsRoute);
app.use(DriverRoute);
app.use(locationRoute);
app.use(DispatchRoute);
app.use(CustomersRoute);
app.use(ProductsRoute);

//Not Found Middleware
app.use((request, response, next) => {
  response
    .status(404)
    .json({ message: `${request.originalUrl} not found on this server!` });
});

//Global error handeling Middleware
app.use((error, request, response, next) => {
  if (error.statusCode && error.statusCode !== 500) {
    // the specific status code from the AppError
    response.status(error.statusCode).json({ message: error.message });
  } else {
    //the default 500 status code handling
    response.status(500).json({ message: error + "" });
  }
});
