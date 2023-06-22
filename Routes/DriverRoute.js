const express = require("express");
const router = express.Router();
const DriverController = require("./../Controllers/DriverController");
const validateMW = require("./../Core/Validations/validateMW");
const {addIMG , removeDriverIMG}=require("./../Core/Validations/imageValidation");
const {
  DriverValidPOST,
  DriverValidPUT,
  DriverValidId,
} = require("./../Core/Validations/DriverVlidation");
const authenticationMW = require("./../Middlewares/authenticationMW");
const authorizationMW = require("./../Middlewares/authorizationMW");

router
  .route("/drivers")
  .get(authenticationMW.auth,authorizationMW.authorize("drivers","viewAll") ,  validateMW, DriverController.getAll)
  .post(authenticationMW.auth, DriverValidPOST,authorizationMW.authorize("drivers","add"),  validateMW, DriverController.addDriver);

router
  .route("/drivers/:id")
  .get(authenticationMW.auth, DriverValidId,authorizationMW.authorize("drivers","viewAll") , validateMW, DriverController.getDriverById)
  .patch(authenticationMW.auth, DriverValidPUT, authorizationMW.authorize("drivers","edit") ,validateMW,addIMG, DriverController.updateDriver)
  .delete(authenticationMW.auth,DriverValidId,authorizationMW.authorize("drivers","delete") , validateMW, removeDriverIMG, DriverController.deleteDriver)
 
  router.route("/driver/ban/:id") 
  .patch(DriverController.BanDriver);//add authorize in schema to this route

router
  .route("/drivers/assignedOrderTo/:id") //add authorize in schema to this route
  .get(DriverController.getDriversToBeAssignedOrderTo);

module.exports = router;
