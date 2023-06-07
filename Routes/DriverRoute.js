const express=require("express");
const router=express.Router();
const DriverController=require("./../Controllers/DriverController");
const validateMW=require("./../Core/Validations/validateMW");
const {DriverValidPOST, DriverValidPUT, DriverValidId} =require("./../Core/Validations/DriverVlidation");
const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/drivers")
        .get( DriverController.getAll ) //authenticationMW.auth
        .post(DriverController.addDriver) //DriverValidPOST ,validateMW, 

router.route("/drivers/:id")
        .get(DriverValidId ,validateMW , DriverController.getDriverById)
        // .put(DriverValidPUT ,validateMW, DriverController.updateUser)
        .delete( DriverController.deleteDriver )//DriverValidId ,validateMW,

      

module.exports=router;