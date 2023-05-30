const mongoose=require("mongoose");
const JWT= require("jsonwebtoken");

require("./../Models/UserModel")
const UserSchema=mongoose.model("user");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");

exports.login = catchAsync(async (req,res,next)=>{
    const {email , password }  = req.body;

    if(!email || !password){
    return next(new AppError(` Missing paramters for login`, 404));
    }

const user = await UserSchema.findOne({email:email}).select("+password");

if(!user || !(await user.correctPassword(password, user.password))){
    return next(new AppError(`Incorrect email or password`, 401));
}

const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_IN});

res.status(200).json({
    status:"success" , 
    token
});
});