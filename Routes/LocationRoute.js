const express=require("express");
const router=express.Router();
const LocationController=require("./../Controllers/LocationController");
const validateMW=require("./../Core/Validations/validateMW");
// const {LocationValidPOST, LocationValidPUT, LocationValidId} =require("./../Core/Validations/LocationValidation");
const authenticationMW = require("./../Middlewares/authenticationMW")

//Governate Routes
router.route("/governates")
       .get(LocationController.getAllGovernates )
    //    .post(GovernateValidPOST ,validateMW, LocationController.addGovernate)
       .post(LocationController.addGovernate)

router.route("/governates/:id")
        .get(LocationController.getGovernateById)
        .put(LocationController.updateGovernate)
        .delete(LocationController.deleteGovernate)

  //City Routes
router.route("/cities")
.get(LocationController.getAllCities)
//    .post(GovernateValidPOST ,validateMW, LocationController.addGovernate)
.post(LocationController.addCity)

router.route("/cities/:id")
 .get(LocationController.getCityById)
 .put(LocationController.updateCity)
 .delete(LocationController.deleteCity)

 //Area Routes
router.route("/areas")
.get(LocationController.getAllAreas)
//    .post(GovernateValidPOST ,validateMW, LocationController.addGovernate)
.post(LocationController.addArea)

router.route("/areas/:id")
 .get(LocationController.getAreaById)
 .put(LocationController.updateArea)
 .delete(LocationController.deleteArea)


 //Location Routes
router.route("/locations")
       .get(LocationController.getAllLocations)
       .post(validateMW, LocationController.addLocation)

router.route("/locations/:id")
        .get(validateMW , LocationController.getLocationById)
        .put(validateMW, LocationController.updateLocation)
        .delete(validateMW, LocationController.deleteLocation )

      

module.exports=router;