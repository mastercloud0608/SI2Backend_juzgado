// src/middlewares/authorizeExpediente.js

const Expediente = require('../models/expediente.model');

module.exports = async function authorizeExpediente(req, res, next) {
  try {
    const idExp = Number(req.params.id);
    const expediente = await Expediente.findByPk(idExp);

    if (!expediente) {
      return res.status(404).json({ msg: 'Expediente no existe' });
    }

    const { id_usuario, rol } = req.user;
    const esAbogadoAsignado = id_usuario === expediente.id_abogado;
    const esAdmin           = rol === 'admin';

    if (!esAbogadoAsignado && !esAdmin) {
      return res.status(403).json({ msg: 'No tienes permiso para ver este expediente' });
    }

    next();
  } catch (err) {
    next(err);
  }
};
