// src/middlewares/authorizeRoles.js
module.exports = (...allowedRoles) => (req, res, next) => {
  // 1) Si no hay usuario, denegar
  if (!req.user) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }

  // 2) Extraer de req.user.roles un arreglo de strings de los id_rol en minúscula
  const userRoles = (req.user.roles || []).map(r => {
    if (r.id_rol)       return r.id_rol.toLowerCase();
    if (r.nombre)       return r.nombre.toLowerCase();
    return null;
  }).filter(Boolean);

  // 3) Verificar que al menos uno de los allowedRoles esté en userRoles
  const autorizado = allowedRoles
    .map(r => r.toLowerCase())
    .some(rolPermitido => userRoles.includes(rolPermitido));

  if (!autorizado) {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }

  next();
};
