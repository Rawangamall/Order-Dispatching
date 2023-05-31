const {body,param}=require("express-validator");

exports.UserValidPOST =[
body("firstName").isString().withMessage("fisrt name should string") ,
body("lastName").isString().withMessage("last name should string") ,
body("email").isEmail().withMessage("should be valid email form") ,
body("image").isString().withMessage("image should string") ,
body("phoneNumber").isNumeric().withMessage("The number should be integer"),
body("Role").isString().withMessage("Role should string") ,
body("password").isString().withMessage("password should string") ,
body("active").isBoolean().withMessage("active should boolean") ,
]

exports.UserValidPUT =[
param("id").isNumeric().withMessage("id should be integer"),
body("fisrtName").isString().withMessage("fisrt name should string") ,
body("lastName").isString().withMessage("last name should string") ,
body("email").isEmail().withMessage("should be valid email form") ,
body("image").isString().withMessage("image should string") ,
body("phoneNumber").isNumeric().withMessage("The number should be integer"),
body("Role").isString().withMessage("Role should string") ,
body("password").isString().withMessage("password should string") ,
body("active").isBoolean().withMessage("active should boolean") ,
]

exports.UserValidId =[
param("id").isNumeric().withMessage("id should be integer"),
]
