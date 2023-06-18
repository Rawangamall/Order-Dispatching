const {body,param}=require("express-validator");

exports.DriverValidPOST =[
// body("driverCode").isNumeric().withMessage("Driver code should be number") ,
body("driverName").isString().withMessage("Driver name should string") ,
body("email").isEmail().withMessage("should be valid email form") ,
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
