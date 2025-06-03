// src/routes/notificacion.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificacion.controller');

// 🔐 Middleware
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// 🔐 Requiere autenticación y que el usuario sea juez, abogado o cliente
router.use(authenticateJWT, authorizeRoles('juez', 'abogado', 'cliente'));

// Obtener todas las notificaciones del usuario
router.get('/', ctrl.getNotificaciones);

// Marcar notificación como leída
router.patch('/:id/leida', ctrl.marcarLeida);

module.exports = router;
