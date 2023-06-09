const {body,param}=require("express-validator");


exports.OrderValidPatch =[
    body("OrderCode").notEmpty().withMessage("order code should be not empty"),   
    body("CustomerID").notEmpty().isNumeric().withMessage("CustomerID should be integer") ,
    body('CustomerName').notEmpty().isString().withMessage('CustomerName should be a string'),
    body('CustomerEmail').isEmail().withMessage("should be valid email form"),
    body('Governate').notEmpty().isString().withMessage('Governate should be a string'),
    body('Area').notEmpty().isString().withMessage('Area should be a string'),
    body('City').notEmpty().isString().withMessage('City should be a string'),
    body('CustomerGroup').notEmpty().isString().withMessage('CustomerGroup should be a string'),
    body('TotalPrice').notEmpty().isInt().withMessage('TotalPrice should be an integer'),
    body('Status').isIn(['confirm', 'picked', 'cancelled', 'assign', 'reassigned', 'delivered']).withMessage('Status should be one of the following: confirm, picked, cancelled, assign, reassigned, delivered'),
    body('product_id').notEmpty().notEmpty().withMessage('product_id should not be empty'),
    body('name_en').notEmpty().isString().withMessage('name_en should be a string'),
    body('quantity').notEmpty().isNumeric().withMessage('quantity should be a number'),
    body('price').notEmpty().isNumeric().withMessage('price should be a number'),
    body('PaymentMethod').notEmpty().isIn(['cash', 'online']).withMessage('PaymentMethod should be either cash or online'),
    body('DriverID').notEmpty().isNumeric().withMessage('DriverID should be a number') 
];
  
 