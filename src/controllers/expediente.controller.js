// src/controllers/expediente.controller.js
const service = require('../services/expediente.service');

async function getExpedientes(req, res) {
  try {
    const rows = await service.listExpedientes();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function crearExpediente(req, res) {
  try {
    const nuevo = await service.createExpediente(req.body);
    res.status(201).json({ mensaje: 'Expediente creado correctamente', expediente: nuevo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function deleteExpediente(req, res) {
  try {
    const borrado = await service.deleteExpediente(req.params.id);
    if (!borrado) return res.status(404).json({ mensaje: 'Expediente no encontrado' });
    res.json({ mensaje: 'Expediente eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar el expediente' });
  }
}

async function updateExpediente(req, res) {
  try {
    const actualizado = await service.updateExpediente(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: 'Expediente no encontrado' });
    res.json({ mensaje: 'Expediente actualizado exitosamente', expediente: actualizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar el expediente' });
  }
}

async function getExpedientesByAbogado(req, res) {
  try {
    const rows = await service.getExpedientesByAbogado(req.params.carnet);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener expedientes' });
  }
}

async function getExpedientesByJuez(req, res) {
  try {
    const rows = await service.getExpedientesByJuez(req.params.carnet);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener expedientes' });
  }
}

async function getClientes(req, res) {
  try {
    const rows = await service.listClientes();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function getAbogados(req, res) {
  try {
    const rows = await service.listAbogados();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function getJueces(req, res) {
  try {
    const rows = await service.listJueces();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function postAbogado(req, res) {
  try {
    await expedienteService.agregarAbogado(req.params.id, req.body.id_usuario);
    res.status(200).json({ mensaje: 'Abogado vinculado correctamente' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAbogados(req, res) {
  try {
    const abogados = await expedienteService.listarAbogados(req.params.id);
    res.json(abogados);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteAbogado(req, res) {
  try {
    await expedienteService.quitarAbogado(req.params.id, req.params.usuarioId);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getExpedientes,
  crearExpediente,
  deleteExpediente,
  updateExpediente,
  getExpedientesByAbogado,
  getExpedientesByJuez,
  getClientes,
  getAbogados,
  getJueces,
  postAbogado,
  getAbogados,
  deleteAbogado
};
