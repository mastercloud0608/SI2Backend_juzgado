// src/services/juez.service.js
const { Usuario, Rol } = require('../models'); // Asegúrate de importar Usuario y Rol
const Expediente = require('../models/expediente.model'); // Si necesitas incluir expedientes
const { Op } = require('sequelize');

/**
 * Lista todos los usuarios que tienen el rol 'juez'
 */
async function listJueces() {
  return Usuario.findAll({
    attributes: ['id_usuario', 'nombre', 'apellido', 'correo', 'telefono'],
    include: [{
      model: Rol,
      as: 'roles',
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
  // Verificar si el correo ya existe en la base de datos
  const existingUser = await Usuario.findOne({ where: { correo: data.correo } });

  if (existingUser) {
    throw new Error('El correo electrónico ya está registrado');
  }

  // Crear el nuevo usuario (juez)
  const usuario = await Usuario.create(data);

  // Buscar el rol 'juez' en la base de datos
  const juezRol = await Rol.findOne({ where: { id_rol: 'juez' } });

  if (!juezRol) {
    throw new Error('Rol de juez no encontrado');
  }

  // Asociar el rol 'juez' al usuario recién creado
  await usuario.addRoles(juezRol); // Método adecuado para la relación muchos a muchos

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
  const roles = await usuario.getRoles({ where: { id_rol: 'juez' } });
  if (roles.length === 0) {
    const juezRol = await Rol.findOne({ where: { id_rol: 'juez' } });
    if (juezRol) {
      await usuario.addRoles(juezRol);
    }
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
      as: 'expedientes'   // Si quieres incluir sus expedientes
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
