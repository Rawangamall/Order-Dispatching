const express=require("express");
const router=express.Router();
const RoleController=require("./../Controllers/RoleController");
const validateMW=require("./../Core/Validations/validateMW");
const {RoleValidPOST,RoleValidPUT,RoleValidId}=require("./../Core/Validations/RoleValidation");

const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/roles")
       .get(RoleController.getRoles )
       .post(RoleValidPOST ,validateMW, RoleController.addRole)
       

router.route("/roles/:id")
        .get( validateMW , RoleController.getRoleById)
        .put( validateMW,RoleController.updateRole)
        .delete( validateMW,RoleController.deleteRole)

      

module.exports=router;