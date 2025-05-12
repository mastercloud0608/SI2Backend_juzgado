// src/controllers/cliente.controller.js
const service = require('../services/cliente.service');

async function getClientes(req, res) {
  try {
    const rows = await service.listClientes();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function getClienteById(req, res) {
  try {
    const cliente = await service.getCliente(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function crearCliente(req, res) {
  try {
    const data = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo: req.body.email,
      password_hash: req.body.password, // asume que ya viene hasheado o quieres adaptarlo aquí
      telefono: req.body.telefono,
      calle: req.body.calle,
      ciudad: req.body.ciudad,
      codigo_postal: req.body.codigo_postal
    };
    const cliente = await service.createCliente(data);
    res.status(201).json({ mensaje: 'Cliente creado correctamente', cliente });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function updateCliente(req, res) {
  try {
    const data = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo: req.body.email,
      password_hash: req.body.password, // igual consideración de hashing
      telefono: req.body.telefono,
      calle: req.body.calle,
      ciudad: req.body.ciudad,
      codigo_postal: req.body.codigo_postal
    };
    const cliente = await service.updateCliente(req.params.id, data);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente actualizado correctamente', cliente });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar el cliente' });
  }
}

async function deleteCliente(req, res) {
  try {
    const cliente = await service.deleteCliente(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al eliminar el cliente' });
  }
}

async function getPerfilCliente(req, res) {
  try {
    const cliente = await service.getPerfilCliente(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener perfil del cliente' });
  }
}

module.exports = {
  getClientes,
  getClienteById,
  crearCliente,
  updateCliente,
  deleteCliente,
  getPerfilCliente
};
