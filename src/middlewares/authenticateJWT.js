// src/middlewares/authenticateJWT.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

module.exports = function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no provisto' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};
