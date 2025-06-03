// src/routes/expediente.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/expediente.controller');
const authorizeExpediente = require('../middlewares/authorizeExpediente');
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Protección global para todas las rutas
router.use(authenticateJWT);
router.use(authorizeRoles('admin', 'abogado', 'juez'));

// CRUD Expedientes
router.get('/', controller.getExpedientes);
router.post('/', controller.crearExpediente);
router.delete('/:id', controller.deleteExpediente);
router.put('/:id', controller.updateExpediente);

// Listados auxiliares
router.get('/clientes', controller.getClientes);
router.get('/abogados', controller.getAbogados);
router.get('/jueces', controller.getJueces);

// Filtrar por abogado o juez
router.get('/abogado/:carnet', controller.getExpedientesByAbogado);
router.get('/juez/:carnet', controller.getExpedientesByJuez);

// Asignación de abogados a un expediente
router.post('/:id/abogados', controller.postAbogado);
router.get('/:id/abogados', controller.getAbogados);
router.delete('/:id/abogados/:usuarioId', controller.deleteAbogado);

module.exports = router;
