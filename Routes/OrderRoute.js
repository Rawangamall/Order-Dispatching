const express=require("express");
const router=express.Router();
const orderController=require("./../Controllers/OrderController");
const validateMW=require("./../Core/Validations/validateMW");
const {OrderValidPatch}=require("./../Core/Validations/OrderValidate");
const authenticationMW = require("./../Middlewares/authenticationMW")


router.route("/orders")
      .get(orderController.getAll);  //authenticationMW.auth ,

router.route("/orders/Assigned")
      .get(orderController.getAll);  //authenticationMW.auth ,

router.route("/orders/Reassigned")
      .get(orderController.getAll);  //authenticationMW.auth ,

router.route("/orders/Picked")
      .get(orderController.getAll);  //authenticationMW.auth ,

router.route("/orders/Cancelled")
      .get(orderController.getAll);  //authenticationMW.auth ,

router.route("/orders/Delivered")
      .get(orderController.getAll);  //authenticationMW.auth ,

router.route("/orders/NewOrders")
      .get(orderController.getAll);  //authenticationMW.auth ,

// router.route("/orders/:_id")
//       .get()
//       .put()

module.exports=router;