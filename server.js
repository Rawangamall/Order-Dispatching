const express= require("express");
const mongoose=require("mongoose");
var bodyParser = require('body-parser')
require('dotenv').config({ path: 'config.env' });

const UserRoute=require("./Routes/UserRoute");
const RoleRoute=require("./Routes/RoleRoute");
const DriverRoute=require("./Routes/DriverRoute");
const loginRoute =require("./Routes/loginRoute");
const OrderRoute =require("./Routes/OrderRoute");

const AppError = require("./utils/appError");
// const cors=require("cors");
// const path=require("path");



//server
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let port=process.env.PORT||8080;


//db connection
mongoose.set('strictQuery', true);  //warning

 mongoose.connect("mongodb+srv://OrderDispatching:iti@cluster0.eesrbrh.mongodb.net/?retryWrites=true&w=majority")
        .then(()=>{
            console.log("DB connected");
            server.listen(port,()=>{
                console.log("server is listenng.....",port);
            });
        })
        .catch(error=>{
            console.log("Db Problem "+error);
        })

//body parse
app.use(express.json());3
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());

//Routes 


app.use(loginRoute);
app.use(RoleRoute);
app.use(UserRoute);
app.use(OrderRoute(io));
app.use(DriverRoute);


//Not Found Middleware
app.use((request,response,next)=>{
  response.status(404).json({message:`${request.originalUrl} not found on this server!`})
})

//Global error handeling Middleware
app.use((error, request, response, next) => {
    if (error.statusCode && error.statusCode !== 500) {
      // Preserve the specific status code from the AppError instance
      response.status(error.statusCode).json({ message: error.message });
    } else {
      // Fallback to the default 500 status code handling
      response.status(500).json({ message: error + "" });
    }
  });
  
