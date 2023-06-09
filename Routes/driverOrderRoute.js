const express=require("express");
const router=express.Router();
const DriverOrderController=require("./../Controllers/driverOrderController");
const validateMW=require("./../Core/Validations/validateMW");
const authenticationMW = require("./../Middlewares/DriverauthenticationMW")
const authorizationMW = require("./../Middlewares/authorizationMW");


router.route("/driver/history")
      .get(authenticationMW.auth,authorizationMW.authorize("driver","history"),validateMW,DriverOrderController.allOrder);      //delivered and cancelled

router.route("/driver/Assignorders")
      .get(authenticationMW.auth,authorizationMW.authorize("driver","Assignorders"),validateMW, DriverOrderController.assignOrder);        //assign order to be picked

router.route("/driver/Pickedorders")
      .get(authenticationMW.auth,authorizationMW.authorize("driver","Pickedorders"),validateMW,DriverOrderController.pickedOrder);       //picked order to be delivered or cancelled
      
router.route("/driver/cancelassign/:_id")
      .patch(authenticationMW.auth,authorizationMW.authorize("driver","cancelassign"),validateMW,DriverOrderController.cancelAssign);        //cancelling assign order
 
router.route("/driver/pick/:_id")
      .patch(authenticationMW.auth,authorizationMW.authorize("driver","pick"),validateMW,DriverOrderController.pickAction);       //picking order

router.route("/driver/deliver/:_id")
      .patch(authenticationMW.auth,authorizationMW.authorize("driver","deliver"),validateMW,DriverOrderController.deliverAction);         //delivering order

router.route("/driver/cancel/:_id")
      .patch(authenticationMW.auth,authorizationMW.authorize("driver","cancel"),validateMW,DriverOrderController.cancelAction);        //cancelling one after picked

router.route("/driver/profile/:_id")
      .get(authenticationMW.auth,validateMW,DriverOrderController.getDriverById);  
module.exports=router;