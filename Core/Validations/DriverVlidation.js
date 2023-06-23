const {body,param}=require("express-validator");
const mongoose = require("mongoose");
require("./../../Models/DriverModel");
const DriverSchema = mongoose.model("driver");

exports.DriverValidPOST =[
body("driverName").isString().withMessage("Driver name should string") ,
body("email").isEmail().withMessage("should be valid email form").custom(async (value) => {
    const user = await DriverSchema.findOne({ email: value });

    if (user) {
      throw new Error('Email is already taken');
    }

    return true;
  }),
body("phoneNumber").isNumeric().withMessage("The number should be integer"),
//body("status").isString().withMessage("Status should string") ,
//body("availability").isString().withMessage("Status should string") ,
body("password").isString().withMessage("password should string") ,
// body("orderCount").isNumeric().withMessage("Count should number") ,
]

exports.DriverValidPUT =[
param("id").isNumeric().withMessage("id should be integer"),
// body("DriverCode").isNumeric().withMessage("Driver code should number") ,
body("driverName").isString().optional().withMessage("Driver name should string") ,
body("email").isEmail().optional().withMessage("should be valid email form") ,
body("phoneNumber").isNumeric().optional().withMessage("The phone number should be integer"),
body("status").isString().optional().withMessage("Status should string") ,
body("availability").isString().optional().withMessage("availability should string") ,
// body("password").isString().withMessage("password should string") ,
body("orderCount").isNumeric().optional().withMessage("Order Count should number") ,
]

exports.DriverValidId =[
param("id").isNumeric().withMessage("id should be integer"),
]
