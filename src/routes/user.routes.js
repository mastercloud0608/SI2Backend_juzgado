// src/routes/user.routes.js
const express = require('express');
const router = express.Router();
const { getRoles, updateRoles } = require('../controllers/user.controller');

// 🔐 Middlewares
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Autenticación obligatoria y solo ADMIN puede ver o actualizar roles
router.use(authenticateJWT, authorizeRoles('admin'));

// Obtener roles de un usuario
router.get('/:id/roles', getRoles);

// Actualizar roles de un usuario
router.put('/:id/roles', updateRoles);

module.exports = router;
