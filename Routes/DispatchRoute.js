const express = require("express");
const router = express.Router();
const dispatchController=require("../Controllers/dispatchController");

router.route(`/dispatch/:_id`)
      .get(dispatchController.assignOrder)

module.exports = router;
