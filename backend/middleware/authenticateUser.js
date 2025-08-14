const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send({ error: 'No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      return res.status(401).send({ error: 'User not found.' });
    }

    req.user = user; // Setting the user object on the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).send({ error: 'Authentication failed.' });
  }
};

module.exports = authenticateUser;
