const express=require("express");
const router=express.Router();
const userController=require("./../Controllers/UserController");
  
  
router.route("/users")
       .get(userController.getAll)
       .post(userController.addUser)

module.exports=router;