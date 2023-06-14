// Assuming you have your Express routes and controllers set up
const JWT= require("jsonwebtoken");
const mongoose = require('mongoose');
const { defaultMaxListeners } = require('nodemailer/lib/xoauth2');
const RoleModel = mongoose.model('role');

// Middleware function for authorization
exports.authorize = (model, permission) => async (req, res, next) => {
  // console.log(req.headers.authorization);
  const token = req.headers.authorization;

  // Check if the token exists
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify and decode the token
    const [bearerPrefix, actualToken] = token.split(' ');
    const decoded = JWT.verify(actualToken, process.env.JWT_SECRET);
    console.log(decoded); 
    // Access the id and roleName from the decoded token
    const { id, roleName } = decoded;
    

    // Attach the id and roleName to the request object for further use
    req.userId = id;
    req.roleName = roleName;
    // console.log(req.userId);
    // console.log(req.roleName);
    // Continue to the next middleware or route handler
  
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const roleName = req.roleName; // Assuming you have the user's role ID in the request
    // console.log(req);
    console.log(roleName);
    const role = await RoleModel.findOne({ name: roleName });

    // Check if the user has permissions for the specific model and permission
    if (role && role.permissions[model] && role.permissions[model][permission]) {
      // User is authorized to access the endpoint
      next();
    } else {
      // User is not authorized
      res.status(403).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    // Error occurred while fetching the role or performing authorization check
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

