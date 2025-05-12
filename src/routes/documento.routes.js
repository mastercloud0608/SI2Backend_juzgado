const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const upload  = multer({ storage: multer.memoryStorage() });
const ctrl    = require('../controllers/documento.controller');

router.post('/',            upload.single('archivo'), ctrl.subirDocumento);
router.get('/expediente/:id',            ctrl.listarPorExpediente);
router.get('/:id/download',             ctrl.descargarDocumento);
router.post('/:id/version',  upload.single('archivo'), ctrl.subirVersion);
router.get('/:id/version',              ctrl.listarVersiones);
router.get('/:id/version/:numero/download', ctrl.descargarVersion);

module.exports = router;
