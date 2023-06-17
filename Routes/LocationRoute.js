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

router.route("/locations").post(LocationController.addLocation);

router.route("/locations/governates").get(LocationController.getallgovernate);

router
  .route("/locations/governates/:_id")
  .get(LocationController.getOneGovernate)
  .patch(LocationController.editgovernate)
  .delete(LocationController.deleteGovernate);

router.route("/locations/cities").get(LocationController.getallcities);

router
  .route("/locations/cities/:_id")
  .patch(LocationController.editcity)
  .delete(LocationController.deleteCity)
  .get(LocationController.getOneCity);

router.route("/locations/areas").get(LocationController.getallareas);

router
  .route("/locations/areas/:_id")
  .patch(LocationController.editarea)
  .delete(LocationController.deletearea)
  .get(LocationController.getOneArea);

module.exports = router;
