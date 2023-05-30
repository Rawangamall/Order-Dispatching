const express=require("express");
const router=express.Router();
const authentication = require("./../Middlewares/authenticationMW")
  
router.route("/login")
      .post(authentication.login)

module.exports=router;