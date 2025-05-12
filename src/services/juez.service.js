// src/services/juez.service.js
const Rol     = require('../models/rol.model');
const Expediente = require('../models/expediente.model'); // si necesitas incluir expedientes
const { Op } = require('sequelize');

/**
 * Lista todos los usuarios que tienen el rol 'juez'
 */
async function listJueces() {
  return Usuario.findAll({
    attributes: ['id_usuario', 'nombre', 'apellido', 'correo', 'telefono'],
    include: [{
      model: Rol,
      where: { id_rol: 'juez' },
      attributes: []
    }]
  });
}

/**
 * Obtiene un juez por su ID de usuario
 */
async function getJuezById(id) {
  return Usuario.findOne({
    where: { id_usuario: id },
    include: [{
      model: Rol,
      where: { id_rol: 'juez' },
      attributes: []
    }]
  });
}

/**
 * Crea un nuevo usuario con rol 'juez'
 * data debe incluir: nombre, apellido, correo, password_hash, ...
 */
async function createJuez(data) {
  const usuario = await Usuario.create(data);
  await usuario.addRol('juez');
  return usuario;
}

/**
 * Actualiza datos del juez
 */
async function updateJuez(id, data) {
  const [updatedCount, [usuario]] = await Usuario.update(data, {
    where: { id_usuario: id },
    returning: true
  });
  if (!updatedCount) return null;
  // Asegurar que conserva el rol
  const roles = await usuario.getRols({ where: { id_rol: 'juez' } });
  if (roles.length === 0) {
    await usuario.addRol('juez');
  }
  return usuario;
}

/**
 * Elimina el usuario (y su rol por cascada)
 */
async function deleteJuez(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;
  await usuario.destroy();
  return usuario;
}

/**
 * Perfil de juez buscado por carnet_identidad
 */
async function getPerfilJuez(carnet) {
  return Usuario.findOne({
    where: { carnet_identidad: carnet },
    include: [{
      model: Rol,
      where: { id_rol: 'juez' },
      attributes: []
    },
    {
      model: Expediente,
      as: 'expedientes'   // si quieres incluir sus expedientes
    }]
  });
}

module.exports = {
  listJueces,
  getJuezById,
  createJuez,
  updateJuez,
  deleteJuez,
  getPerfilJuez
};
