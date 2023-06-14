// // Assuming you have your Express routes and controllers set up

// const mongoose = require('mongoose');
// const RoleModel = mongoose.model('role');

// // Middleware function for authorization
// const authorize = (model, permission) => async (req, res, next) => {
//   try {
//     const roleName = req.roleName; // Assuming you have the user's role ID in the request
//     const role = await RoleModel.findOne({ name: roleName });

//     // Check if the user has permissions for the specific model and permission
//     if (role && role.model ) {
//       // User is authorized to access the endpoint
//       next();
//     } else {
//       // User is not authorized
//       res.status(403).json({ error: 'Unauthorized' });
//     }
//   } catch (error) {
//     // Error occurred while fetching the role or performing authorization check
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// // // Example route with authorization middleware for orders
// // app.get('/api/orders', authorize('orders', 'viewAll'), (req, res) => {
// //   // Your endpoint logic
// // });

// // // Example route with authorization middleware for customers
// // app.get('/api/customers', authorize('customers', 'viewAll'), (req, res) => {
// //   // Your endpoint logic
// // });

// // // Example route with authorization middleware for locations
// // app.get('/api/locations', authorize('locations', 'view'), (req, res) => {
// //   // Your endpoint logic
// // });
