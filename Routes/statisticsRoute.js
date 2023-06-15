const express=require("express");
const router=express.Router();
const statisticsController=require("./../Controllers/statisticsController");
const authenticationMW = require("./../Middlewares/authenticationMW");
const validateMW=require("./../Core/Validations/validateMW");
const authorizationMW = require("./../Middlewares/authorizationMW");

router.route("/total/orders")
       .get(statisticsController.allOrder)


router.route("/total/assignorders")
      .get(statisticsController.allAssignOrder)

router.route("/total/reassignorders")
      .get(statisticsController.allReassignOrder)

router.route("/total/pickedorders")
      .get(statisticsController.allPickedOrder)

router.route("/total/deliveredorders")
      .get(statisticsController.allDeliveredOrder)

router.route("/total/cancelledorders")
      .get(statisticsController.allCancelledOrder)

router.route("/total/newdorders")
      .get(statisticsController.allNewOrder)

 module.exports=router;