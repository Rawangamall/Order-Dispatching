const express=require("express");
const router=express.Router();
const orderController=require("./../Controllers/OrderController");
const validateMW=require("./../Core/Validations/validateMW");
const {OrderValidPatch}=require("./../Core/Validations/OrderValidate");
const authenticationMW = require("./../Middlewares/authenticationMW")


router.route("/orders")
      .get(orderController.getAll);  //authenticationMW.auth ,validateMW

router.route("/orders/Assigned")
      .get(orderController.getAssignedOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Reassigned")
      .get(orderController.getReassignedOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Picked")
      .get(orderController.getPickedOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Cancelled")
      .get(orderController.getCancelledOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Delivered")
      .get(orderController.getDeliveredOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/NewOrders")
      .get(orderController.getNewOrdersOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/:_id")    
      .get(orderController.getoneOrder)
      .patch(orderController.updateOrder)

router.route("/orders/add").post(orderController.addorder)
module.exports=router;