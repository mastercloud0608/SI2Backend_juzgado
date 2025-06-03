// src/routes/documento.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const ctrl = require('../controllers/documento.controller');

const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// Todas las rutas requieren autenticación y rol autorizado
router.use(authenticateJWT);
router.use(authorizeRoles('admin', 'abogado', 'juez'));

// Subir nuevo documento
router.post('/', upload.single('archivo'), ctrl.subirDocumento);

// Listar documentos por expediente
router.get('/expediente/:id', ctrl.listarPorExpediente);

// Descargar archivo original
router.get('/:id/download', ctrl.descargarDocumento);

// Subir nueva versión
router.post('/:id/version', upload.single('archivo'), ctrl.subirVersion);

// Ver versiones
router.get('/:id/version', ctrl.listarVersiones);

// Descargar versión específica
router.get('/:id/version/:numero/download', ctrl.descargarVersion);

module.exports = router;
