// src/routes/abogado.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/abogado.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Solo ADMIN puede gestionar abogados
router.get('/', authorizeRoles('admin'), controller.getAbogados);
router.get('/:id', authorizeRoles('admin'), controller.getAbogadoById);
router.post('/', authorizeRoles('admin'), controller.crearAbogado);
router.put('/:id', authorizeRoles('admin'), controller.updateAbogado);
router.delete('/:id', authorizeRoles('admin'), controller.deleteAbogado);

// ADMIN y ABOGADO pueden ver el perfil del abogado
router.get('/:id/perfil', authorizeRoles('admin', 'abogado'), controller.getPerfilAbogado);

module.exports = router;
