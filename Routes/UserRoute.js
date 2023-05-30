const express=require("express");
const router=express.Router();
const userController=require("./../Controllers/UserController");
const authentication = require("./../Middlewares/authenticationMW")

  
router.route("/users")
       .get(authentication.auth,userController.getAll)
       .post(userController.addUser)

module.exports=router;