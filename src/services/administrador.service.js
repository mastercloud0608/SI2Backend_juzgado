// src/services/administrador.service.js
const Rol     = require('../models/rol.model');
const { Op }  = require('sequelize');

/**
 * Lista todos los usuarios con rol 'administrador'
 */
async function listAdministradores() {
  return Usuario.findAll({
    attributes: ['id_usuario','nombre','apellido','correo','telefono'],
    include: [{
      model: Rol,
      where: { id_rol: 'administrador' },
      attributes: []
    }]
  });
}

/**
 * Crea un nuevo usuario y le asigna el rol 'administrador'
 * data debe incluir: nombre, apellido, correo, password_hash, etc.
 */
async function createAdministrador(data) {
  const usuario = await Usuario.create(data);
  await usuario.addRol('administrador');
  return usuario;
}

module.exports = {
  listAdministradores,
  createAdministrador
};
