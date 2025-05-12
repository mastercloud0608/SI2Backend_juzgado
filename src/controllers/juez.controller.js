// src/controllers/juez.controller.js
const service = require('../services/juez.service');

async function getJueces(req, res) {
  try {
    const rows = await service.listJueces();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function getJuezById(req, res) {
  try {
    const juez = await service.getJuezById(req.params.id);
    if (!juez) return res.status(404).json({ mensaje: 'Juez no encontrado' });
    res.json(juez);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function crearJuez(req, res) {
  try {
    const data = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo: req.body.email,
      password_hash: req.body.password, // si lo hasheas antes o aquí
      telefono: req.body.telefono,
      calle: req.body.calle,
      ciudad: req.body.ciudad,
      codigo_postal: req.body.codigo_postal,
      carnet_identidad: req.body.carnet_identidad
    };
    const juez = await service.createJuez(data);
    res.status(201).json({ mensaje: 'Juez creado correctamente', juez });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function updateJuez(req, res) {
  try {
    const data = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo: req.body.email,
      password_hash: req.body.password,
      telefono: req.body.telefono,
      calle: req.body.calle,
      ciudad: req.body.ciudad,
      codigo_postal: req.body.codigo_postal,
      carnet_identidad: req.body.carnet_identidad
    };
    const juez = await service.updateJuez(req.params.id, data);
    if (!juez) return res.status(404).json({ mensaje: 'Juez no encontrado' });
    res.json({ mensaje: 'Juez actualizado correctamente', juez });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar el juez' });
  }
}

async function deleteJuez(req, res) {
  try {
    const juez = await service.deleteJuez(req.params.id);
    if (!juez) return res.status(404).json({ mensaje: 'Juez no encontrado' });
    res.json({ mensaje: 'Juez eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar el juez' });
  }
}

async function getPerfilJuez(req, res) {
  try {
    const juez = await service.getPerfilJuez(req.params.carnet);
    if (!juez) return res.status(404).json({ mensaje: 'Juez no encontrado' });
    res.json(juez);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener perfil del juez' });
  }
}

module.exports = {
  getJueces,
  getJuezById,
  crearJuez,
  updateJuez,
  deleteJuez,
  getPerfilJuez
};
