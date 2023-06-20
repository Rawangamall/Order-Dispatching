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
       .post(authenticationMW.auth , authorizationMW.authorize("users","add")  ,UserValidPOST ,validateMW, userController.addUser)

router.route("/users/:id")
        .get(authenticationMW.auth,UserValidId , authorizationMW.authorize("users","viewAll") ,validateMW , userController.getUserById)
        .put(authenticationMW.auth,UserValidPUT , authorizationMW.authorize("users","edit"),validateMW,userController.updateUser)
        .delete(authenticationMW.auth,UserValidId , authorizationMW.authorize("users","delete"),validateMW,userController.deleteUser )

      

module.exports=router;