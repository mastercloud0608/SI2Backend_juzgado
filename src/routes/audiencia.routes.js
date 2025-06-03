// src/routes/audiencia.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/audiencia.controller');

const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Todas las rutas requieren autenticación
router.use(authenticateJWT);

// Listar y crear audiencias (admin, abogado, juez)
router.get('/', authorizeRoles('admin', 'abogado', 'juez'), ctrl.listarAudiencias);
router.post('/', authorizeRoles('admin', 'abogado', 'juez'), ctrl.crearAudiencia);

// Obtener, actualizar, eliminar (admin, juez)
router.get('/:id', authorizeRoles('admin', 'juez'), ctrl.obtenerAudiencia);
router.put('/:id', authorizeRoles('admin', 'juez'), ctrl.actualizarAudiencia);
router.delete('/:id', authorizeRoles('admin'), ctrl.eliminarAudiencia);

// Resolver audiencia (admin, juez)
router.patch('/:id/resolver', authorizeRoles('admin', 'juez'), ctrl.resolverAudiencia);

// Manejo de partes (admin, abogado, juez)
router.post('/:id/partes', authorizeRoles('admin', 'abogado', 'juez'), ctrl.postParte);
router.get('/:id/partes', authorizeRoles('admin', 'abogado', 'juez'), ctrl.getPartes);
router.delete('/:id/partes/:parteId', authorizeRoles('admin', 'abogado', 'juez'), ctrl.deleteParte);

// Vincular usuario (solo admin)
router.post('/usuarios/vincular', authorizeRoles('admin'), ctrl.postUsuario);

// Actualizar observación (admin, juez)
router.patch('/:id/observacion', authorizeRoles('admin', 'juez'), ctrl.actualizarObservacion);

module.exports = router;
