const express=require("express");
const router=express.Router();
const loginController=require("../Controllers/loginController");
  
router.route("/login")
      .post(loginController.login);

router.route("/forgetpassword")
       .post(loginController.forgetpassword);

router.route("/resetpassword")
      .patch(loginController.resetpassword);

module.exports=router;