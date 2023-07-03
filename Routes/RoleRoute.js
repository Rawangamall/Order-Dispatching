const express=require("express");
const router=express.Router();
const RoleController=require("./../Controllers/RoleController");
const validateMW=require("./../Core/Validations/validateMW");
const {RoleValidPOST,RoleValidPUT,RoleValidId}=require("./../Core/Validations/RoleValidation");

const authenticationMW = require("./../Middlewares/authenticationMW")

  
router.route("/roles")
       .get(authenticationMW.auth,RoleController.getRoles )
       .post(authenticationMW.auth,RoleValidPOST ,validateMW, RoleController.addRole)
       

router.route("/roles/:id")
        .get(authenticationMW.auth, validateMW , RoleController.getRoleById)
        .put( authenticationMW.auth,validateMW,RoleController.updateRole)
        .delete(authenticationMW.auth, validateMW,RoleController.deleteRole)

      

module.exports=router;