const express = require('express');
const router = express.Router();
const { getAdministradores, crearAdministrador } = require('../controllers/administrador.controller');

router.get('/', getAdministradores);
router.post('/', crearAdministrador);


module.exports = router;
