const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('No token provided'); // Debugging: Log when no token is provided
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Ensure this secret matches the one used to sign the token
    console.log('Decoded token:', decoded); // Debugging: Log the decoded token
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = auth;
