const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
 try {
  // Get the token from the request header, removing the 'Bearer ' prefix
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // If no token is found, return a 401 Unauthorized status
  if (!token) {
   return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  // Verify the token's signature using the secret key
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // Find the user in the database based on the ID from the decoded token, excluding the password field
  const user = await User.findById(decoded.userId).select('-password');
  
  // If no user is found, the token is considered invalid, so return a 401 status
  if (!user) {
   return res.status(401).json({ message: 'Token is not valid' });
  }
  
  // Attach the found user object to the request for use in subsequent middleware or route handlers
  req.user = user;
  
  // Call the next middleware function in the stack
  next();
 } catch (error) {
  // Log any errors that occur during authentication
  console.error('Auth middleware error:', error);
  
  // If an error occurs (e.g., token is expired or malformed), return a 401 Unauthorized status
  res.status(401).json({ message: 'Token is not valid' });
 }
};

// Export the middleware function
module.exports = auth;