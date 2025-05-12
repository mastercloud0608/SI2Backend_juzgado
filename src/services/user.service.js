// src/services/user.service.js
const Rol     = require('../models/rol.model');

async function getUserRoles(userId) {
  const user = await Usuario.findByPk(userId, {
    include: { model: Rol, through: { attributes: [] } }
  });
  if (!user) throw new Error('Usuario no encontrado.');
  return user.Rols.map(r => r.id_rol);
}

async function setUserRoles(userId, roles = []) {
  const user = await Usuario.findByPk(userId);
  if (!user) throw new Error('Usuario no encontrado.');

  // Buscar los roles válidos en la tabla rol
  const rolRecords = await Rol.findAll({ where: { id_rol: roles } });
  // Reemplaza todos los roles del usuario con los nuevos
  await user.setRols(rolRecords);
  return rolRecords.map(r => r.id_rol);
}

module.exports = { getUserRoles, setUserRoles };
