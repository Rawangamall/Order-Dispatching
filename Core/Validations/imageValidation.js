const multer=require("multer");
const path=require("path");
const fs = require('fs');
const mongoose=require("mongoose");
const { response } = require("express");

require("./../../Models/UserModel")
require("./../../Models/DriverModel");

const UserSchema=mongoose.model("user");
const DriverSchema = mongoose.model("driver");

exports.addIMG=multer({
    fileFilter: function (req, file, cb) {
        if (file.mimetype != "image/png" && file.mimetype != "image/jpg" && file.mimetype != "image/jpeg" ) {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
    },
    limits: { fileSize: 10000*10000 },
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
          
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            if(fullUrl.includes("users")){
                cb(null,path.join(__dirname,"..","images","User"));
                console.log(path.join(__dirname,"..","images","User"))
            }else{
                cb(null,path.join(__dirname,"..","images","Driver"));
            }

        } , 
        filename:(request, file, cb)=>{
            var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
            console.log(fullUrl,"link url")
            if(fullUrl.includes("users")){
          
                userId = request.params.id;
                console.log(userId)
                imageName = userId + "." + "jpg";
                request.image = imageName
                cb(null, imageName);

                }
            
         }
    })
}).single("image")

exports.removeUserIMG=function(req,res,next){
    UserSchema.findOne({_id:req.params.id}).then((data)=>{
        if(data != null){
        imageName = data._id+ "." + "jpg";
        console.log(imageName)
        fs.unlink(path.join(__dirname,"..","images","User",imageName), function (err) {
            if (err)
                next(new Error("User not found"));
            else
                next();
        })
    }
    })
}