// src/routes/administrador.routes.js
const express = require('express');
const router = express.Router();
const { getAdministradores, crearAdministrador } = require('../controllers/administrador.controller');

const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Autenticación obligatoria
router.use(authenticateJWT);

// Solo ADMIN puede listar y crear administradores
router.get('/', authorizeRoles('admin'), getAdministradores);
router.post('/', authorizeRoles('admin'), crearAdministrador);

module.exports = router;
