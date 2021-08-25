const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new Unauthorized('Необходима авторизация'));
  }
  return jwt.verify(token, 'secretKey123', (err, decoded) => {
    if (err) {
      return next(new Unauthorized('Необходима авторизация'));
    }
    req.user = decoded;
    return next();
  });
};
