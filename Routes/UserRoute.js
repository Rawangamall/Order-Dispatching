const express=require("express");
const router=express.Router();
const userController=require("./../Controllers/UserController");
const validateMW=require("./../Core/Validations/validateMW");


const {UserValidPOST,UserValidPUT,UserValidId}=require("./../Core/Validations/UserValidation");

 

  
  
router.route("/users")
       .get(userController.getAll )
       .post(UserValidPOST ,validateMW, userController.addUser)

router.route("/users/:id")
        .get(UserValidId ,validateMW , userController.getUserById)
        .put(UserValidPUT ,validateMW,userController.updateUser)
        .delete(UserValidId ,validateMW,userController.deleteUser )



module.exports=router;