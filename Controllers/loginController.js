const mongoose=require("mongoose");
const JWT= require("jsonwebtoken");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

require("./../Models/UserModel")
require("./../Models/RoleModel")
require("./../Models/DriverModel");

const UserSchema=mongoose.model("user");
const RoleSchema=mongoose.model("role");
const DriverSchema = mongoose.model("driver");

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

const role_id = user.role_id;
const role = await RoleSchema.findById(role_id).exec();
const RoleName = role ? role.name : null;
const token = JWT.sign({id:user._id , roleName:RoleName , roleId: user.role_id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_IN});

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

try{ await sendEmail({
     to: user.email,
     subject:'Your password reset code valid for 10 minutes only!',
     message
    });
res.status(200).json({ message:"success send email"});

}catch(err){
 user.code = undefined
 user.passwordResetExpires = undefined
 await user.save({validateBeforeSave : false });

 return next(new AppError("Error sending this email. send it later!",err),500);

}

});


exports.isValidToken = async (req,res,next)=>{
    const token = req.headers.authorization;

    try {
        
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
    
        console.log(decoded)
        const expirationDate = new Date(decoded.exp * 1000); 
        const currentDate = new Date();
    
        if (currentDate > expirationDate) {
          return res.status(401).json({ message: 'Token expired' });
        }
    
        return res.status(200).json({ message: 'Token is valid' });
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
}

exports.resetpassword = catchAsync(async (req,res,next)=>{

    if((req.body.code == "") && (req.body.password) == "" && (req.body.confirmPassword) == "") {
        return next(new AppError("Enter valid input"),400);
    }

const hashToken = crypto.createHash('sha256').update(req.body.code).digest('hex');

const user = await UserSchema.findOne({code: hashToken ,
     passwordResetExpires : {$gt : Date.now()}
    });

    if(!user){
    return next(new AppError("Code is invalid or expired"),400);
    }

if(req.body.password === req.body.confirmPassword){
user.password = bcrypt.hashSync(req.body.password ,salt) 
user.code = undefined    //to be removed from db
user.passwordResetExpires = undefined
await user.save();
}else{
    return next(new AppError("Password not matched!"),404);
}

res.status(200).json({
    status:"success"
});

});


exports.driverlogin = catchAsync(async (req,res,next)=>{
    const {email , password }  = req.body;

    if(!email || !password){
    return next(new AppError(` Missing paramters for login`, 404));
    }

const driver = await DriverSchema.findOne({email:email}).select("+password");
console.log(driver)
if(!driver || !(await driver.correctPassword(password, driver.password))){
    return next(new AppError(`Incorrect email or password`, 401));
}
if(driver.status == "not active"){
    return next(new AppError(`You're not allowed to login!, U're not active now`, 401));
}

const token = JWT.sign({id:driver._id },process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE_IN});

res.status(200).json({
    status:"success" , 
    token
});
});