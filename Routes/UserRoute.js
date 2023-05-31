const express=require("express");
const router=express.Router();
const userController=require("./../Controllers/UserController");
const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/users")
       .get(authenticationMW.auth,userController.getAll)
       .post(userController.addUser)

module.exports=router;