// src/routes/cliente.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/cliente.controller');

const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// ADMIN puede gestionar clientes
router.get('/',          authorizeRoles('admin'), controller.getClientes);
router.get('/:id',       authorizeRoles('admin'), controller.getClienteById);
router.post('/',         authorizeRoles('admin'), controller.crearCliente);
router.put('/:id',       authorizeRoles('admin'), controller.updateCliente);
router.delete('/:id',    authorizeRoles('admin'), controller.deleteCliente);

// ADMIN y CLIENTE pueden ver el perfil (el cliente solo si es él mismo — control interno)
router.get('/:id/perfil', authorizeRoles('admin', 'cliente'), controller.getPerfilCliente);

module.exports = router;
