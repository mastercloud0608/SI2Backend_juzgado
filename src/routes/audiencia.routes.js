// src/routes/audiencia.routes.js
const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/audiencia.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Todas las operaciones de audiencias requieren que el usuario esté autenticado
// y tenga rol 'administrador', 'abogado' o 'juez'
router.use(
  authenticateJWT,
  authorizeRoles('administrador', 'abogado', 'juez')
);

router
  .route('/')
  .get(ctrl.listarAudiencias)
  .post(ctrl.crearAudiencia);

router
  .route('/:id')
  .get(ctrl.obtenerAudiencia)
  .put(ctrl.actualizarAudiencia)
  .delete(ctrl.eliminarAudiencia);

// PATCH /audiencias/:id/resolver
// Solo roles 'juez' o 'administrador' pueden resolver
router.patch(
  '/:id/resolver',
  authenticateJWT,
  authorizeRoles('juez', 'administrador'),
  ctrl.resolverAudiencia
);

router.post  ('/:id/partes',            ctrl.postParte);
router.get   ('/:id/partes',            ctrl.getPartes);
router.delete('/:id/partes/:parteId',   ctrl.deleteParte);
router.post('/  usuarios/vincular', ctrl.postUsuario);
router.patch('/:id/observacion', ctrl.actualizarObservacion);




module.exports = router;
