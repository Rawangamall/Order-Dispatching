const express=require("express");
const router=express.Router();
const LocationController=require("./../Controllers/LocationController");
const validateMW=require("./../Core/Validations/validateMW");
const {LocationValidPOST, LocationValidPUT, LocationValidId} =require("./../Core/Validations/LocationValidation");
const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/locations")
       .post(LocationController.addLocation)

      // .get(authenticationMW.auth ,LocationController.getAll )
    //    .post(DriverValidPOST ,validateMW, DriverController.addUser)

// router.route("/locations/:id")
//         .get(DriverValidId ,validateMW , DriverController.getUserById)
//         .put(DriverValidPUT ,validateMW, DriverController.updateUser)
//         .delete(DriverValidId ,validateMW, DriverController.deleteUser )

      

module.exports=router;