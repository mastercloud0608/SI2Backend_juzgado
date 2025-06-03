// src/middlewares/authorizeRoles.js
module.exports = (...allowedRoles) => (req, res, next) => {
  const { rol } = req.user;
  if (!allowedRoles.includes(rol)) {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }
  next();
};
