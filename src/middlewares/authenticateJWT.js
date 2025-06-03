// src/middlewares/authenticateJWT.js
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret';

module.exports = async function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no provisto' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // 1) Validar y decodificar el JWT
    const payload = jwt.verify(token, JWT_SECRET);

    // 2) Buscar al usuario en la BD junto con sus roles
    const user = await Usuario.findByPk(payload.id, {
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    // 3) Adjuntar el usuario completo (incluyendo roles) a req.user
    req.user = user;
    next();
  } catch (err) {
    console.error('[🚨 authenticateJWT]', err);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};
