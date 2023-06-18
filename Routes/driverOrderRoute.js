const express=require("express");
const router=express.Router();
const DriverOrderController=require("./../Controllers/driverOrderController");
const validateMW=require("./../Core/Validations/validateMW");
const authenticationMW = require("./../Middlewares/authenticationMW")

router.route("/driver/history")
      .get(DriverOrderController.allOrder);

router.route("/driver/Assignorders")
      .get(DriverOrderController.assignOrder);

router.route("/driver/Pickedorders")
      .get(DriverOrderController.pickedOrder);
      
router.route("/driver/Cancelledorders")
      .get(DriverOrderController.cancelledOrder);
      
module.exports=router;