const multer=require("multer");
const path=require("path");
const fs = require('fs');
const mongoose=require("mongoose");
const { response } = require("express");

require("./../../Models/UserModel")
require("./../../Models/DriverModel");

const UserSchema=mongoose.model("user");
const DriverSchema = mongoose.model("driver");
const AppError = require("./../../utils/appError");

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
            }else if(fullUrl.includes("drivers")){
                cb(null,path.join(__dirname,"..","images","Driver"));
            }else{
                return next(new AppError(`Foriegn User`, 401));
            }

        } , 
        filename:(request, file, cb)=>{
            var fullUrl = request.protocol + '://' + request.get('host') + request.originalUrl;
            console.log(fullUrl,"link url")
          
                userId = request.params.id;
                console.log(userId)
                imageName = userId + "." + "jpg";
                request.image = imageName
                cb(null, imageName);

            
         }
    })
}).single("image")

exports.removeUserIMG=function(req,res,next){
    UserSchema.findOne({_id:req.params.id}).then((data)=>{
        if(data != null && data.image != "default.jpg"){
        imageName = data._id+ "." + "jpg";
        console.log(imageName)
        fs.unlink(path.join(__dirname,"..","images","User",imageName), function (err) {
            if (err)
                next(new Error("User not found"));
            else
                next();
        })
    }
    next();
    })
}

exports.removeDriverIMG=function(req,res,next){
    DriverSchema.findOne({_id:req.params.id}).then((data)=>{
        if(data != null && data.image != "default.jpg"){
        imageName = data._id+ "." + "jpg";
        console.log(imageName,"in img valid")
        fs.unlink(path.join(__dirname,"..","images","Driver",imageName), function (err) {
            if (err)
                next(new Error("Driver not found"));
            else
                next();
        })
    }
    next();

    })
}