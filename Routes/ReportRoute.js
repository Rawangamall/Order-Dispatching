const express = require("express");
const router = express.Router();
const reportController = require("./../Controllers/ReportController");

router.route("/report").get(reportController.finalReport);
router.route("/generate-pdf").get(reportController.generatePDF);

module.exports = router;
