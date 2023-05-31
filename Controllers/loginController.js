const mongoose=require("mongoose");
const JWT= require("jsonwebtoken");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

require("./../Models/UserModel")
const UserSchema=mongoose.model("user");

const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/CatchAsync");
const sendEmail = require("./../utils/email");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)


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

exports.forgetpassword = catchAsync(async (req,res,next)=>{
    const user = await UserSchema.findOne({email:req.body.email});
    if(!user){
        return next(new AppError(`User of that email not found`, 401));
    }

    const resetToken = await user.createPasswordRandomToken()
    await user.save({validateBeforeSave : false });

    const message = `<p>Hi ${user.firstName}<br>Forgot your password? No worries, we’ve got you covered. Submit with that code <span style="color:red; font-weight:bold;">${resetToken}</span> and new password to reset it.🚚</p>`

try{    await sendEmail({
     to: user.email,
     subject:'Your password reset code valid for 10 minutes only!',
     message
    });
res.status(200).json({ message:"success send email"});

}catch(err){
 user.passwordResetToken = undefined
 user.passwordResetExpires = undefined
 await user.save({validateBeforeSave : false });

 return next(new AppError("Error sending this email. send it later!",err),500);

}

});

exports.resetpassword = catchAsync(async (req,res,next)=>{

const hashToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

const user = await UserSchema.findOne({passwordResetToken: hashToken ,
     passwordResetExpires : {$gt : Date.now()}
    });

    if(!user){
    return next(new AppError("Token is invalid or expired"),400);
    }

if(req.body.password === req.body.confirmPassword){
user.password = bcrypt.hashSync(req.body.password ,salt) 
user.passwordResetToken = undefined    //to be removed from db
user.passwordResetExpires = undefined
await user.save();
}else{
    return next(new AppError("Password not matched!"),404);
}

const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_IN});

res.status(200).json({
    status:"success" , 
    token
});

});