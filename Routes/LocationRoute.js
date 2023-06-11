const express=require("express");
const router=express.Router();
const LocationController=require("./../Controllers/LocationController");
const validateMW=require("./../Core/Validations/validateMW");
const {GovernateValidPOST, GovernateValidPUT, GovernateValidId} =require("./../Core/Validations/LocationValidation");
const {CityValidPOST, CityValidPUT, CityValidId} =require("./../Core/Validations/LocationValidation");
const {AreaValidPOST, AreaValidPUT, AreaValidId} =require("./../Core/Validations/LocationValidation");
const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/locations")
       .post(LocationController.addLocation)
       .get(LocationController.getallLocation)
       .patch(LocationController.UpdateLocation)
       .delete(LocationController.DeleteLocation)
    

module.exports=router;