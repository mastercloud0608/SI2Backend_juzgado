// src/routes/expediente.routes.js
const express = require('express');
const router  = express.Router();
const controller = require('../controllers/expediente.controller');
const authorizeExpediente = require('../middlewares/authorizeExpediente');
const ctrl = require('../controllers/expediente.controller');


// CRUD Expedientes
router.get('/',               controller.getExpedientes);
router.post('/',              controller.crearExpediente);
router.delete('/:id',         controller.deleteExpediente);
router.put('/:id',            controller.updateExpediente);

// Listados auxiliares
router.get('/clientes',       controller.getClientes);
router.get('/abogados',       controller.getAbogados);
router.get('/jueces',         controller.getJueces);

// Filtrar por abogado o juez
router.get('/abogado/:carnet',controller.getExpedientesByAbogado);
router.get('/juez/:carnet',   controller.getExpedientesByJuez);

router.post  ('/:id/abogados',          ctrl.postAbogado);
router.get   ('/:id/abogados',          ctrl.getAbogados);
router.delete('/:id/abogados/:usuarioId', ctrl.deleteAbogado);

module.exports = router;
