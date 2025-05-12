// src/controllers/abogado.controller.js
const service = require('../services/abogado.service');

async function getAbogados(req, res) {
  try {
    const rows = await service.listAbogados();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function getAbogadoById(req, res) {
  try {
    const abogado = await service.getAbogado(req.params.id);
    if (!abogado) return res.status(404).json({ mensaje: 'Abogado no encontrado' });
    res.json(abogado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function crearAbogado(req, res) {
  try {
    const abogado = await service.createAbogado(req.body);
    res.status(201).json({ mensaje: 'Abogado creado correctamente', abogado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function updateAbogado(req, res) {
  try {
    const abogado = await service.updateAbogado(req.params.id, req.body);
    if (!abogado) return res.status(404).json({ mensaje: 'Abogado no encontrado' });
    res.json({ mensaje: 'Abogado actualizado correctamente', abogado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar el abogado' });
  }
}

async function deleteAbogado(req, res) {
  try {
    const abogado = await service.deleteAbogado(req.params.id);
    if (!abogado) return res.status(404).json({ mensaje: 'Abogado no encontrado' });
    res.json({ mensaje: 'Abogado eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar el abogado' });
  }
}

async function getPerfilAbogado(req, res) {
  try {
    const perfil = await service.getPerfilAbogado(req.params.id);
    if (!perfil) return res.status(404).json({ mensaje: 'Abogado no encontrado' });
    res.json(perfil);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener perfil del abogado' });
  }
}

module.exports = {
  getAbogados,
  getAbogadoById,
  crearAbogado,
  updateAbogado,
  deleteAbogado,
  getPerfilAbogado
};
