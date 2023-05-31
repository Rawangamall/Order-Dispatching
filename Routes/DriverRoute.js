const express=require("express");
const router=express.Router();
const DriverController=require("./../Controllers/DriverController");
const validateMW=require("./../Core/Validations/validateMW");
const {DriverValidPOST, DriverValidPUT, DriverValidId} =require("./../Core/Validations/DriverVlidation");
const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/drivers")
       .get(authenticationMW.auth ,DriverController.getAll )
       .post(DriverValidPOST ,validateMW, DriverController.addUser)

router.route("/drivers/:id")
        .get(DriverValidId ,validateMW , DriverController.getUserById)
        .put(DriverValidPUT ,validateMW, DriverController.updateUser)
        .delete(DriverValidId ,validateMW, DriverController.deleteUser )

      

module.exports=router;