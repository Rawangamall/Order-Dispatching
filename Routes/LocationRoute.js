const express = require("express");
const router = express.Router();
const LocationController = require("./../Controllers/LocationController");
const validateMW = require("./../Core/Validations/validateMW");
const {
  GovernateValidPOST,
  GovernateValidPUT,
  GovernateValidId,
} = require("./../Core/Validations/LocationValidation");
const {
  CityValidPOST,
  CityValidPUT,
  CityValidId,
} = require("./../Core/Validations/LocationValidation");
const {
  AreaValidPOST,
  AreaValidPUT,
  AreaValidId,
} = require("./../Core/Validations/LocationValidation");
const authenticationMW = require("./../Middlewares/authenticationMW");
const authorizationMW = require("./../Middlewares/authorizationMW");


router.route("/locations").post(authenticationMW.auth, authorizationMW.authorize("locations","add"),validateMW, LocationController.addLocation);

router.route("/locations/governates").get(authenticationMW.auth, authorizationMW.authorize("locations","view"),validateMW,LocationController.getallgovernate);

router
  .route("/locations/governates/:_id")
  .get(authenticationMW.auth, authorizationMW.authorize("locations","view"),validateMW,LocationController.getOneGovernate)
  .patch(authenticationMW.auth, authorizationMW.authorize("locations","edit"),validateMW,LocationController.editgovernate)
  .delete(authenticationMW.auth, authorizationMW.authorize("locations","delete"),validateMW,LocationController.deleteGovernate);

router.route("/locations/cities").get(authenticationMW.auth, authorizationMW.authorize("locations","view"),validateMW,LocationController.getallcities);

router
  .route("/locations/cities/:_id")
  .patch(authenticationMW.auth, authorizationMW.authorize("locations","edit"),validateMW,LocationController.editcity)
  .delete(authenticationMW.auth, authorizationMW.authorize("locations","delete"),validateMW,LocationController.deleteCity)
  .get(authenticationMW.auth, authorizationMW.authorize("locations","view"),validateMW,LocationController.getOneCity);

router.route("/locations/areas").get(authenticationMW.auth, authorizationMW.authorize("locations","view"),validateMW,LocationController.getallareas);

router
  .route("/locations/areas/:_id")
  .patch(authenticationMW.auth, authorizationMW.authorize("locations","edit"),validateMW,LocationController.editarea)
  .delete(authenticationMW.auth, authorizationMW.authorize("locations","delete"),validateMW,LocationController.deletearea)
  .get(authenticationMW.auth, authorizationMW.authorize("locations","view"),validateMW,LocationController.getOneArea);

module.exports = router;
