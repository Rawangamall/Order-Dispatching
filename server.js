const express= require("express");
const mongoose=require("mongoose");
var bodyParser = require('body-parser')

//server
const server = express();
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
server.use(express.json());
server.use(express.urlencoded({extended:false}));
server.use(bodyParser.json())

//Routes 



//Not Found Middleware
server.use((request,response,next)=>{
    response.status(404).json({message:"Not Found"})
})

//ERROR handeling Middleware
server.use((error,request,response,next)=>{
    response.status(500).json({message:error+""});
})