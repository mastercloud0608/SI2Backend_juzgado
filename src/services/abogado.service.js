// src/services/abogado.service.js

const { Abogado, Expediente } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = {
  listAbogados,
  getAbogado,
  createAbogado,
  updateAbogado,
  deleteAbogado,
  getPerfilAbogado,
};

/**
 * Lista todos los abogados (sin exponer contraseñas).
 */
async function listAbogados() {
  return Abogado.findAll({
    attributes: ['id', 'nombre', 'apellido', 'carnet_identidad', 'email'],
  });
}

/**
 * Obtiene un abogado por su ID
 */
async function getAbogado(id) {
  return Abogado.findByPk(id, {
    attributes: ['id', 'nombre', 'apellido', 'carnet_identidad', 'email'],
  });
}

/**
 * Crea un nuevo abogado.
 * data: { nombre, apellido, carnet_identidad, email, password }
 * Si tu modelo Abogado **no** almacena contraseña, omite el paso de bcrypt
 * y simplemente llama a Abogado.create({ nombre, apellido, ... }).
 */
async function createAbogado(data) {
  // 1) Validar que no exista otro abogado con el mismo email
  const existente = await Abogado.findOne({ where: { email: data.email } });
  if (existente) {
    throw new Error('Ya existe un abogado con ese correo.');
  }

  // 2) Hashear la contraseña (solo si tu modelo Abogado tiene campo password_hash)
  let hashedPassword = null;
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(data.password, salt);
  }

  // 3) Crear el registro en la tabla `abogados`
  const nuevoAbogado = await Abogado.create({
    nombre: data.nombre,
    apellido: data.apellido,
    carnet_identidad: data.carnet_identidad,
    email: data.email,
    // Si tu modelo tiene password_hash, inclúyelo. Si no, elimínalo.
    ...(hashedPassword && { password_hash: hashedPassword }),
    // …otros campos que puedas tener (teléfono, dirección, etc.)…
  });

  return nuevoAbogado;
}

/**
 * Actualiza un abogado existente.
 * data: { nombre?, apellido?, carnet_identidad?, email?, password? }
 */
async function updateAbogado(id, data) {
  // 1) Buscar al abogado
  const abogado = await Abogado.findByPk(id);
  if (!abogado) {
    return null;
  }

  // 2) Preparar objeto con los campos a actualizar
  const camposAActualizar = {
    nombre: data.nombre !== undefined ? data.nombre : abogado.nombre,
    apellido: data.apellido !== undefined ? data.apellido : abogado.apellido,
    carnet_identidad: data.carnet_identidad || abogado.carnet_identidad,
    email: data.email !== undefined ? data.email : abogado.email,
    // …otros campos que tengas en tu modelo…
  };

  // 3) Si viene nueva contraseña, la hasheamos (solo si tu modelo la almacena)
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    camposAActualizar.password_hash = await bcrypt.hash(data.password, salt);
  }

  // 4) Ejecutar el update en la base de datos
  const [updatedCount, [updatedAbogado]] = await Abogado.update(camposAActualizar, {
    where: { id },
    returning: true,
  });

  return updatedCount ? updatedAbogado : null;
}

/**
 * Elimina un abogado
 */
async function deleteAbogado(id) {
  const abogado = await Abogado.findByPk(id);
  if (!abogado) return null;
  await abogado.destroy();
  return abogado;
}

/**
 * Perfil de abogado + sus expedientes (demandante o demandado).
 * Asume que tu modelo `Expediente` tiene los campos
 *   abogado_demandante_carnet y abogado_demandado_carnet
 * que coinciden con `carnet_identidad` en la tabla `abogados`.
 */
async function getPerfilAbogado(id) {
  // 1) Buscar datos básicos del abogado
  const abogado = await Abogado.findByPk(id, {
    attributes: ['id', 'nombre', 'apellido', 'carnet_identidad', 'email'],
  });
  if (!abogado) return null;

  // 2) Buscar todos los expedientes donde este abogado figure como demandante o demandado
  const expedientes = await Expediente.findAll({
    where: {
      [Op.or]: [
        { abogado_demandante_carnet: abogado.carnet_identidad },
        { abogado_demandado_carnet:   abogado.carnet_identidad }
      ]
    }
  });

  return { abogado, expedientes };
}
