const express=require("express");
const router=express.Router();
const DriverOrderController=require("./../Controllers/driverOrderController");
const validateMW=require("./../Core/Validations/validateMW");
const authenticationMW = require("./../Middlewares/authenticationMW")

router.route("/driver/history")
      .get(DriverOrderController.allOrder);      //delivered and cancelled

router.route("/driver/Assignorders")
      .get(DriverOrderController.assignOrder);        //assign order to be picked

router.route("/driver/Pickedorders")
      .get(DriverOrderController.pickedOrder);       //picked order to be delivered or cancelled
      
// router.route("/driver/Cancelledorders")
//       .get(DriverOrderController.cancelledOrder);     //addition one
     
router.route("/driver/pick/:_id")
      .patch(DriverOrderController.pickAction);       //picking order

router.route("/driver/deliver/:_id")
      .patch(DriverOrderController.deliverAction);         //delivering order

router.route("/driver/cancel/:_id")
      .patch(DriverOrderController.cancelAction);        //cancelling one
 
module.exports=router;