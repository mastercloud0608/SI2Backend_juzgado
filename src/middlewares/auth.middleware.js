// src/middlewares/auth.middleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function authMiddleware(req, res, next) {
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).json({ msg: 'Sin token, acceso denegado' });
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Payload debe incluir al menos { id_usuario, rol }
    req.user = { id_usuario: payload.id_usuario, rol: payload.rol };
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token no válido' });
  }
};
