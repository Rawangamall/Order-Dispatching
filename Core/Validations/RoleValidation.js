
const {body,param}=require("express-validator");

exports.RoleValidPOST =[
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('statistics.viewAll').optional().isBoolean().withMessage('Statistics viewAll must be a boolean'),
    body('users.viewAll').optional().isBoolean().withMessage('Users viewAll must be a boolean'),
    body('users.add').optional().isBoolean().withMessage('Users add must be a boolean'),
    body('users.edit').optional().isBoolean().withMessage('Users edit must be a boolean'),
    body('users.delete').optional().isBoolean().withMessage('Users delete must be a boolean'),
    body('users.activateDeactivate').optional().isBoolean().withMessage('Users activateDeactivate must be a boolean'),
    body('orders.viewAll').optional().isBoolean().withMessage('Orders viewAll must be a boolean'),
    body('orders.edit').optional().isBoolean().withMessage('Orders edit must be a boolean'),
    body('customers.viewAll').optional().isBoolean().withMessage('Customers viewAll must be a boolean'),
    body('locations.view').optional().isBoolean().withMessage('Locations view must be a boolean'),
    body('locations.add').optional().isBoolean().withMessage('Locations add must be a boolean'),
    body('locations.edit').optional().isBoolean().withMessage('Locations edit must be a boolean'),
    body('locations.delete').optional().isBoolean().withMessage('Locations delete must be a boolean'),
    body('drivers.viewAll').optional().isBoolean().withMessage('Drivers viewAll must be a boolean'),
    body('drivers.add').optional().isBoolean().withMessage('Drivers add must be a boolean'),
    body('drivers.edit').optional().isBoolean().withMessage('Drivers edit must be a boolean'),
    body('drivers.delete').optional().isBoolean().withMessage('Drivers delete must be a boolean'),
    body('roles.viewAll').optional().isBoolean().withMessage('Roles viewAll must be a boolean'),
    body('roles.add').optional().isBoolean().withMessage('Roles add must be a boolean'),
    body('roles.edit').optional().isBoolean().withMessage('Roles edit must be a boolean')
  
]

exports.RoleValidPUT =[
    body('user_id').optional().notEmpty().withMessage('User ID is required'),
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('statistics.viewAll').optional().isBoolean().withMessage('Statistics viewAll must be a boolean'),
    body('users.viewAll').optional().isBoolean().withMessage('Users viewAll must be a boolean'),
    body('users.add').optional().isBoolean().withMessage('Users add must be a boolean'),
    body('users.edit').optional().isBoolean().withMessage('Users edit must be a boolean'),
    body('users.delete').optional().isBoolean().withMessage('Users delete must be a boolean'),
    body('users.activateDeactivate').optional().isBoolean().withMessage('Users activateDeactivate must be a boolean'),
    body('orders.viewAll').optional().isBoolean().withMessage('Orders viewAll must be a boolean'),
    body('orders.edit').optional().isBoolean().withMessage('Orders edit must be a boolean'),
    body('customers.viewAll').optional().isBoolean().withMessage('Customers viewAll must be a boolean'),
    body('locations.view').optional().isBoolean().withMessage('Locations view must be a boolean'),
    body('locations.add').optional().isBoolean().withMessage('Locations add must be a boolean'),
    body('locations.edit').optional().isBoolean().withMessage('Locations edit must be a boolean'),
    body('locations.delete').optional().isBoolean().withMessage('Locations delete must be a boolean'),
    body('drivers.viewAll').optional().isBoolean().withMessage('Drivers viewAll must be a boolean'),
    body('drivers.add').optional().isBoolean().withMessage('Drivers add must be a boolean'),
    body('drivers.edit').optional().isBoolean().withMessage('Drivers edit must be a boolean'),
    body('drivers.delete').optional().isBoolean().withMessage('Drivers delete must be a boolean'),
    body('roles.viewAll').optional().isBoolean().withMessage('Roles viewAll must be a boolean'),
    body('roles.add').optional().isBoolean().withMessage('Roles add must be a boolean'),
    body('roles.edit').optional().isBoolean().withMessage('Roles edit must be a boolean')
  
]

// exports.RoleValidId =[
// param("user_id").isNumeric().withMessage("id should be integer"),
// ]
