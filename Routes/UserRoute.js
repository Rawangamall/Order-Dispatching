const express=require("express");
const router=express.Router();
const userController=require("./../Controllers/UserController");
const validateMW=require("./../Core/Validations/validateMW");
const {UserValidPOST,UserValidPUT,UserValidId}=require("./../Core/Validations/UserValidation");
const authenticationMW = require("./../Middlewares/authenticationMW");
const authorizationMW = require("./../Middlewares/authorizationMW");


// import authorize from './../Middlewares/authorizationMw';
  
router.route("/users")
       .get(authenticationMW.auth , authorizationMW.authorize("users","viewAll") , validateMW,userController.getAll )
       .post(UserValidPOST ,validateMW, userController.addUser)

router.route("/users/:id")
        .get(UserValidId ,validateMW , userController.getUserById)
        .put(UserValidPUT ,validateMW,userController.updateUser)
        .delete(UserValidId ,validateMW,userController.deleteUser )

      

module.exports=router;