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

router.route("/drivers")
  .get(DriverController.getAll)
  .post(DriverValidPOST, validateMW, DriverController.addDriver);

router.route("/drivers/:id")
  .get(DriverValidId, validateMW, DriverController.getDriverById)
  .patch(DriverValidPUT, validateMW,addIMG, DriverController.updateDriver)
  .delete(DriverValidId, validateMW,removeDriverIMG, DriverController.deleteDriver)
  .patch(DriverController.BanDriver);
router
  .route("/drivers/assignedOrderTo/:id")
  .get(DriverController.getDriversToBeAssignedOrderTo);

module.exports = router;
