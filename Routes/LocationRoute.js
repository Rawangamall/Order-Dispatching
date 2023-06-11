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

// router.route("/locations/search/:_id")
//        .post(LocationController.searchLocation)

      // .get(authenticationMW.auth ,LocationController.getAll )
    //    .post(DriverValidPOST ,validateMW, DriverController.addUser)

// router.route("/governates/:id")
//         .get(GovernateValidId, validateMW, LocationController.getGovernateById)
//         .put(GovernateValidPUT, validateMW, LocationController.updateGovernate)
//         .delete(GovernateValidId, validateMW, LocationController.deleteGovernate)

//   //City Routes
// router.route("/cities")
//     .get(LocationController.getAllCities)
//     .post(CityValidPOST, validateMW ,LocationController.addCity)

// router.route("/cities/:id")
//     .get(CityValidId, validateMW,LocationController.getCityById)
//     .put(CityValidPUT, validateMW,LocationController.updateCity)
//     .delete(CityValidId, validateMW,LocationController.deleteCity)

//  //Area Routes
// router.route("/areas")
//     .get(LocationController.getAllAreas)
//     .post(AreaValidPOST, validateMW ,LocationController.addArea)

// router.route("/areas/:id")
//     .get(AreaValidId, validateMW ,LocationController.getAreaById)
//     .put(AreaValidPUT, validateMW,LocationController.updateArea)
//     .delete(AreaValidId, validateMW ,LocationController.deleteArea)


//  //Location Routes
// router.route("/locations")
//        .get(LocationController.getAllLocations)
//        .post(validateMW, LocationController.addLocation)

// router.route("/locations/:id")
//         .get(validateMW , LocationController.getLocationById)
//         .put(validateMW, LocationController.updateLocation)
//         .delete(validateMW, LocationController.deleteLocation )

      

module.exports=router;