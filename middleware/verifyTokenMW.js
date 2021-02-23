const jwt = require('jsonwebtoken');
const config = require('config')

function verifyToken(req, res, next) {
  let token
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(403).send({ message: 'No token provided.' });
  }

  jwt.verify(token, config.get('jwtSecret'), function (err, decoded) {
    if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });
    req.userId = decoded.userId;
    next();
  });
}

module.exports = verifyToken;