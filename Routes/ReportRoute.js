const express = require("express");
const router = express.Router();
const userController = require("./../Controllers/ReportController");

router.route("/report").get(userController.finalReport);

module.exports = router;
