// src/routes/index.js
const express = require('express');
const router = express.Router();

const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

const authRoutes         = require('./auth.routes');
const adminRoutes        = require('./administrador.routes');
const clientRoutes       = require('./cliente.routes');
const lawyerRoutes       = require('./abogado.routes');
const judgeRoutes        = require('./juez.routes');
const caseRoutes         = require('./expediente.routes');
const userRoutes         = require('./user.routes');
const documentRoutes     = require('./documento.routes');
const audienciaRoutes    = require('./audiencia.routes');
const notificacionRoutes = require('./notificacion.routes');

// 1) Rutas públicas
router.use('/auth', authRoutes);

// 2) A partir de aquí, todas las rutas requieren JWT
router.use(authenticateJWT);

// 3) Rutas exclusivas ADMIN
router.use('/administradores', authorizeRoles('admin'), adminRoutes);
router.use('/users',           authorizeRoles('admin'), userRoutes);

// 4) Gestión de ABOGADOS (solo ADMIN)
router.use('/abogados',        authorizeRoles('admin'), lawyerRoutes);

// 5) Gestión de JUECES (solo ADMIN)
router.use('/jueces',          authorizeRoles('admin'), judgeRoutes);

// 6) Gestión de CLIENTES (solo ADMIN para crear/editar/eliminar)
router.use('/clientes',        authorizeRoles('admin', 'abogado'), clientRoutes);

// 7) Gestión de EXPEDIENTES (ADMIN, ABOGADO, JUEZ)
router.use('/expedientes',     authorizeRoles('admin', 'abogado', 'juez'), caseRoutes);

// 8) Gestión de AUDIENCIAS (ADMIN, ABOGADO, JUEZ)
router.use('/audiencias',      authorizeRoles('admin', 'abogado', 'juez'), audienciaRoutes);

// 9) Gestión de DOCUMENTOS (ADMIN, ABOGADO, JUEZ)
router.use('/documentos',      authorizeRoles('admin', 'abogado', 'juez'), documentRoutes);

// 10) Notificaciones (cualquier usuario autenticado)
router.use('/notificaciones',  notificacionRoutes);

// 11) Catch-all 404
router.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

module.exports = router;
