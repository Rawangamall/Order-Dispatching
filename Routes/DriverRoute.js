const express=require("express");
const router=express.Router();
const DriverController=require("./../Controllers/DriverController");
const validateMW=require("./../Core/Validations/validateMW");
const {DriverValidPOST, DriverValidPUT, DriverValidId} =require("./../Core/Validations/DriverVlidation");
const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/drivers")
       .get(DriverController.getAll)
       .post(DriverValidPOST ,validateMW, DriverController.addDriver)

router.route("/drivers/:id")
        .get(DriverValidId ,validateMW , DriverController.getDriverById)
        .put(DriverValidPUT ,validateMW, DriverController.updateDriver)
        .delete(DriverValidId ,validateMW, DriverController.deleteDriver)

router.route("/drivers/assignedOrderTo/:id")
        .get(DriverController.getDriversToBeAssignedOrderTo)

      

module.exports=router;