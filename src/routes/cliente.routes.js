// src/routes/cliente.routes.js
const express = require('express');
const router  = express.Router();
const controller = require('../controllers/cliente.controller');

// Listar todos los clientes
router.get('/', controller.getClientes);

// Obtener cliente por ID
router.get('/:id', controller.getClienteById);

// Crear nuevo cliente
router.post('/', controller.crearCliente);

// Actualizar cliente existente
router.put('/:id', controller.updateCliente);

// Eliminar cliente
router.delete('/:id', controller.deleteCliente);

// Perfil de cliente con expedientes
router.get('/:id/perfil', controller.getPerfilCliente);

module.exports = router;
