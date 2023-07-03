const express = require("express");
const router = express.Router();
const reportController = require("./../Controllers/ReportController");
const authenticationMW = require("./../Middlewares/authenticationMW")

router.route("/report").
      get(authenticationMW.auth,reportController.finalReport);
router.route("/generate-pdf")
      .get(authenticationMW.auth,reportController.generatePDF);

module.exports = router;
