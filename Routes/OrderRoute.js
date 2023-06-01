const express=require("express");
const router=express.Router();
const orderController=require("./../Controllers/OrderController");
const validateMW=require("./../Core/Validations/validateMW");
const {OrderValidPatch}=require("./../Core/Validations/OrderValidate");
const authenticationMW = require("./../Middlewares/authenticationMW")


router.route("/orders")
      .get(orderController.getAll);  //authenticationMW.auth ,

// router.route("/orders/:_id")
//       .get()
//       .put()

module.exports=router;