const express = require("express");
const router = express.Router();
const customerController = require("./../Controllers/CustomerController");

router.route("/customers").get(customerController.getAllCustomers);

module.exports = router;
