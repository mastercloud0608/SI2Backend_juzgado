// src/routes/abogado.routes.js
const express = require('express');
const router  = express.Router();
const controller = require('../controllers/abogado.controller');

// Listar todos
router.get('/', controller.getAbogados);

// Obtener por ID
router.get('/:id', controller.getAbogadoById);

// Crear nuevo
router.post('/', controller.crearAbogado);

// Actualizar existente
router.put('/:id', controller.updateAbogado);

// Eliminar
router.delete('/:id', controller.deleteAbogado);

// Perfil con expedientes
router.get('/:id/perfil', controller.getPerfilAbogado);

module.exports = router;
