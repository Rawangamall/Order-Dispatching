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
       .post(authenticationMW.auth , authorizationMW.authorize("users","add") ,UserValidPOST ,validateMW, userController.addUser) 

router.route("/users/:id")
      
        .get(authenticationMW.auth  , UserValidId , authorizationMW.authorize("users","viewAll") ,validateMW , userController.getUserById)
        .patch(authenticationMW.auth , authorizationMW.authorize("users","edit"),validateMW,addIMG,userController.updateUser) //UserValidPUT , authorizationMW.authorize("users","edit"),validateMW,
        .delete(authenticationMW.auth,UserValidId , authorizationMW.authorize("users","delete"),validateMW,removeUserIMG , userController.deleteUser ) //UserValidId , authorizationMW.authorize("users","delete"),validateMW,
         
 
router.route("/nav/users/:id")     
      .get(UserValidId,validateMW , userController.navUser)

router.route("/users/ban/:id")
      .patch(authenticationMW.auth,UserValidId , authorizationMW.authorize("users","activateDeactivate"),validateMW , userController.BanUser) //UserValidId , authorizationMW.authorize("users","ban"),validateMW,

module.exports=router;