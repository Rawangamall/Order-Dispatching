const {body,param}=require("express-validator");

exports.DriverValidPOST =[
body("DriverCode").isNumeric().withMessage("Driver code should be number") ,
body("DriverName").isString().withMessage("Driver name should string") ,
body("email").isEmail().withMessage("should be valid email form") ,
body("phoneNumber").isNumeric().withMessage("The number should be integer"),
body("status").isString().withMessage("Status should string") ,
body("availability").isString().withMessage("Status should string") ,
body("password").isString().withMessage("password should string") ,
body("orderCount").isNumeric().withMessage("Count should number") ,
]

exports.DriverValidPUT =[
param("id").isNumeric().withMessage("id should be integer"),
body("DriverCode").isString().withMessage("Driver code should string") ,
body("DriverName").isString().withMessage("Driver name should string") ,
body("email").isEmail().withMessage("should be valid email form") ,
body("phoneNumber").isNumeric().withMessage("The number should be integer"),
body("status").isString().withMessage("Status should string") ,
body("availability").isString().withMessage("Status should string") ,
body("password").isString().withMessage("password should string") ,
body("orderCount").isNumeric().withMessage("Count should number") ,
]

exports.DriverValidId =[
param("id").isNumeric().withMessage("id should be integer"),
]
