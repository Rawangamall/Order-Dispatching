const express=require("express");
const router=express.Router();
const orderController=require("./../Controllers/OrderController");
const authenticationMW = require("./../Middlewares/authenticationMW");
const validateMW=require("./../Core/Validations/validateMW");
const authorizationMW = require("./../Middlewares/authorizationMW");

const API_KEY = process.env.API_KEY;

function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (apiKey === API_KEY) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid API key' });
  }
}

router.route("/orders/recieve")
      .post(orderController.recieveOrder);   //apiKeyAuth   

router.route("/orders/save")
      .post(orderController.saveOrder);   

router.route("/orders/status")
      .get(orderController.getAllStatus);   

      
router.route("/orders")
      .get(orderController.getAll);  //authenticationMW.auth , authorizationMW.authorize("orders","viewAll"), validateMW ,

router.route("/orders/Assigned")
      .get(orderController.getAssignedOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Reassigned")
      .get(orderController.getReassignedOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Picked")
      .get(orderController.getPickedOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Cancelled")
      .get(orderController.getCancelledOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/Delivered")
      .get(orderController.getDeliveredOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/NewOrders")
      .get(orderController.getNewOrdersOrders);  //authenticationMW.auth ,validateMW

router.route("/orders/:_id")    
      .get(orderController.getoneOrder)
      .patch(orderController.updateOrder)

 //router.route("/orders/add").post(orderController.addOrder)

 module.exports=router;