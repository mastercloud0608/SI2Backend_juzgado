// src/services/cliente.service.js
const Rol     = require('../models/rol.model');
const Expediente = require('../models/expediente.model');
const { Op } = require('sequelize');

/**
 * Lista todos los usuarios que tienen el rol 'cliente'
 */
async function listClientes() {
  return Usuario.findAll({
    attributes: ['id_usuario', 'nombre', 'apellido', 'correo', 'telefono'],
    include: [{
      model: Rol,
      where: { id_rol: 'cliente' },
      attributes: []
    }]
  });
}

/**
 * Obtiene un cliente (usuario+rol) por ID
 */
async function getCliente(id) {
  return Usuario.findOne({
    where: { id_usuario: id },
    include: [{
      model: Rol,
      where: { id_rol: 'cliente' },
      attributes: []
    }]
  });
}

/**
 * Crea un nuevo usuario y le asigna el rol 'cliente'
 * data debe incluir: nombre, apellido, correo, password_hash, ...
 */
async function createCliente(data) {
  // Crear usuario
  const usuario = await Usuario.create(data);
  // Asignar rol
  await usuario.addRol('cliente');
  return usuario;
}

/**
 * Actualiza datos de usuario (cliente)
 */
async function updateCliente(id, data) {
  const [updatedCount, [usuario]] = await Usuario.update(data, {
    where: { id_usuario: id },
    returning: true
  });
  // Asegurar que sigue teniendo rol ‘cliente’
  if (updatedCount && usuario) {
    const roles = await usuario.getRols({ where: { id_rol: 'cliente' } });
    if (roles.length === 0) {
      await usuario.addRol('cliente');
    }
    return usuario;
  }
  return null;
}

/**
 * Elimina el usuario (y por cascada su rol)
 */
async function deleteCliente(id) {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;
  await usuario.destroy();
  return usuario;
}

/**
 * Devuelve el perfil del cliente, incluyendo expedientes asociados.
 * Asume que Expediente tiene FK id_cliente apuntando a Usuario.id_usuario
 */
async function getPerfilCliente(id) {
  const usuario = await Usuario.findOne({
    where: { id_usuario: id },
    include: [
      {
        model: Rol,
        where: { id_rol: 'cliente' },
        attributes: []
      },
      {
        model: Expediente,
        as: 'expedientes'    // Debe coincidir con el alias definido en Usuario.hasMany
      }
    ]
  });
  return usuario;
}

module.exports = {
  listClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
  getPerfilCliente
};
