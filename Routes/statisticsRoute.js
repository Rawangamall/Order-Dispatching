const express = require("express");
const router = express.Router();
const statisticsController = require("./../Controllers/statisticsController");
const authenticationMW = require("./../Middlewares/authenticationMW");
const validateMW = require("./../Core/Validations/validateMW");
const authorizationMW = require("./../Middlewares/authorizationMW");

router.route("/total/orders")
      .get(authenticationMW.auth,statisticsController.allOrder);

router.route("/total/assignorders")
      .get(authenticationMW.auth,statisticsController.allAssignOrder);

router.route("/total/reassignorders")
      .get(authenticationMW.auth,statisticsController.allReassignOrder);

router.route("/total/pickedorders")
      .get(authenticationMW.auth,statisticsController.allPickedOrder);

router.route("/total/deliveredorders")
      .get(authenticationMW.auth,statisticsController.allDeliveredOrder);

router.route("/total/cancelledorders")
      .get(authenticationMW.auth,statisticsController.allCancelledOrder);

router.route("/total/neworders")
      .get(authenticationMW.auth,statisticsController.allNewOrder);

module.exports = router;
