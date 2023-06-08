const {body,param}=require("express-validator");

//Governates
exports.GovernateValidPOST =[
    body("governateName").isString().withMessage("Governate name should string") ,
    body("governateCode").isNumeric().withMessage("Governate number should be integer"),
    ]
    
    exports.GovernateValidPUT =[
    param("id").isNumeric().withMessage("id should be integer"),
    body("governateName").isString().optional().withMessage("Governate name should string") ,
    body("governateCode").isNumeric().optional().withMessage("The Governate Code should be integer")
    ]
    
    exports.GovernateValidId =[
    param("id").isNumeric().withMessage("id should be integer"),
    ]
    
// Cities
    exports.CityValidPOST =[
    body("cityName").isString().withMessage("City name should string") ,
    body("cityCode").isNumeric().withMessage("City Code should be integer"),
        ]
        
    exports.CityValidPUT =[
        param("id").isNumeric().withMessage("id should be integer"),
        body("cityName").isString().optional().withMessage("City name should string") ,
        body("cityCode").isNumeric().optional().withMessage("City Code should be integer")
    ]
        
    exports.CityValidId =[
    param("id").isNumeric().withMessage("id should be integer"),
    ]
        

    // Areas

    exports.AreaValidPOST =[
    body("areaName").isString().withMessage("Area name should string") ,
    body("areaCode").isNumeric().withMessage("Area Code should be integer"),
        ]
        
    exports.AreaValidPUT =[
        param("id").isNumeric().withMessage("id should be integer"),
        body("areaName").isString().optional().withMessage("Area name should string") ,
        body("areaCode").isNumeric().optional().withMessage("Area Code should be integer")
    ]
    
    exports.AreaValidId =[
    param("id").isNumeric().withMessage("id should be integer"),
    ]
        
