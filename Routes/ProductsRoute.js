const express = require("express");
const router = express.Router();
const productController = require("./../Controllers/ProductsController");

router.route("/products").get(productController.getAllProducts);

module.exports = router;
