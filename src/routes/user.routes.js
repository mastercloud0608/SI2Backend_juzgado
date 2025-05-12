// src/routes/user.routes.js
const express = require('express');
const router  = express.Router();
const { getRoles, updateRoles } = require('../controllers/user.controller');

// Opcional: añade tu middleware de autenticación y autorización aquí
// const auth = require('../middlewares/auth.middleware');
// const authorize = require('../middlewares/authorize');

// GET  /api/users/:id/roles   → ver roles de un usuario
// PUT  /api/users/:id/roles   → actualizar roles (body: { roles: ['Juez','Abogado'] })
router.get('/:id/roles'  /*, auth, authorize(['Administrador'])*/, getRoles);
router.put('/:id/roles'  /*, auth, authorize(['Administrador'])*/, updateRoles);

module.exports = router;
