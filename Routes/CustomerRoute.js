const express = require("express");
const router = express.Router();
const customerController = require("./../Controllers/CustomerController");

router.route("/customers").get(customerController.getAllCustomers);
router.route("/customers/:id").get(customerController.getCustomerById);

module.exports = router;
