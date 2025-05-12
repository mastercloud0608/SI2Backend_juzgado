// src/controllers/notificacion.controller.js
const service = require('../services/notificacion.service');

async function getNotificaciones(req, res) {
  try {
    const data = await service.listarNotificaciones(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function marcarLeida(req, res) {
  try {
    const noti = await service.marcarComoLeida(req.params.id);
    if (!noti) return res.status(404).json({ mensaje: 'No encontrada' });
    res.json(noti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getNotificaciones, marcarLeida };
