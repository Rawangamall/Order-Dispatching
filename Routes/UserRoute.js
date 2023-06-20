const express=require("express");
const router=express.Router();
const userController=require("./../Controllers/UserController");
const validateMW=require("./../Core/Validations/validateMW");
const {UserValidPOST,UserValidPUT,UserValidId}=require("./../Core/Validations/UserValidation");
const {addIMG , removeUserIMG}=require("./../Core/Validations/imageValidation");

const authenticationMW = require("./../Middlewares/authenticationMW");
const authorizationMW = require("./../Middlewares/authorizationMW");


// import authorize from './../Middlewares/authorizationMw';
  
router.route("/users")
       .get(authenticationMW.auth , authorizationMW.authorize("users","viewAll") , validateMW,userController.getAll )
       .post(UserValidPOST , userController.addUser) //authenticationMW.auth , authorizationMW.authorize("users","add")  , validateMW

router.route("/users/:id")
        .get(UserValidId , authorizationMW.authorize("users","viewAll") ,validateMW , userController.getUserById)
        .patch(addIMG,userController.updateUser) //UserValidPUT , authorizationMW.authorize("users","edit"),validateMW,
        .delete(removeUserIMG , userController.deleteUser ) //UserValidId , authorizationMW.authorize("users","delete"),validateMW,
         
 
router.route("/nav/users/:id")     
      .get(UserValidId,validateMW , userController.navUser)

module.exports=router;