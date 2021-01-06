const jwt = require('jsonwebtoken');
const config = require('config')

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ message: 'No token provided.' });
    
  jwt.verify(token, config.get('jwtSecret'), function(err, decoded) {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });
  
    // if everything good, save to request for use in other routes
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;