// src/services/notificacion.service.js
const { Notificacion } = require('../models');

async function crearNotificacion(id_usuario, mensaje) {
  return await Notificacion.create({ id_usuario, mensaje });
}

async function listarNotificaciones(id_usuario) {
  return await Notificacion.findAll({ where: { id_usuario }, order: [['fecha', 'DESC']] });
}

async function marcarComoLeida(id) {
  const noti = await Notificacion.findByPk(id);
  if (!noti) return null;
  noti.leida = true;
  await noti.save();
  return noti;
}

module.exports = {
  crearNotificacion,
  listarNotificaciones,
  marcarComoLeida
};
