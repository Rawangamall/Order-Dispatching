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
      .post(apiKeyAuth, orderController.recieveOrder);  

router.route("/orders/save")
      .post(orderController.saveOrder);   

router.route("/orders/status")
      .get(authenticationMW.auth,orderController.getAllStatus);   

      
router.route("/orders")
      .get(authenticationMW.auth , authorizationMW.authorize("orders","viewAll"), validateMW ,orderController.getAll);  

router.route("/orders/Assigned")
      .get(authenticationMW.auth ,validateMW ,orderController.getAssignedOrders);  

router.route("/orders/Reassigned")
      .get(authenticationMW.auth ,validateMW,orderController.getReassignedOrders);  

router.route("/orders/Picked")
      .get(authenticationMW.auth ,validateMW ,orderController.getPickedOrders);  

router.route("/orders/Cancelled")
      .get(authenticationMW.auth ,validateMW,orderController.getCancelledOrders); 

router.route("/orders/Delivered")
      .get(authenticationMW.auth ,validateMW ,orderController.getDeliveredOrders);  

router.route("/orders/NewOrders")
      .get(authenticationMW.auth ,validateMW ,orderController.getNewOrdersOrders); 
      
router.route("/orders/:_id")    
      .get(authenticationMW.auth ,validateMW ,orderController.getoneOrder)


 module.exports=router;