const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificacion.controller');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.use(authenticateJWT);

router.get('/', ctrl.getNotificaciones);
router.patch('/:id/leida', ctrl.marcarLeida);

module.exports = router;
