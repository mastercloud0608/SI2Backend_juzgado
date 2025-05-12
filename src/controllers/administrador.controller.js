// src/controllers/administrador.controller.js
const service = require('../services/administrador.service');

async function getAdministradores(req, res) {
  try {
    const rows = await service.listAdministradores();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

async function crearAdministrador(req, res) {
  try {
    const data = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correo: req.body.email,
      password_hash: req.body.password,  // hazhearlo antes o aquí
      telefono: req.body.telefono,
      calle: req.body.calle,
      ciudad: req.body.ciudad,
      codigo_postal: req.body.codigo_postal
    };
    const admin = await service.createAdministrador(data);
    res.status(201).json({ mensaje: 'Administrador creado correctamente', admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

module.exports = {
  getAdministradores,
  crearAdministrador
};
