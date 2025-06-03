// src/routes/juez.routes.js
const express = require('express');
const router = express.Router();
const {
  getJueces,
  getJuezById,
  crearJuez,
  updateJuez,
  deleteJuez,
  getPerfilJuez
} = require('../controllers/juez.controller');

// 🔐 Middleware de seguridad
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles');

// ✅ Aplica seguridad a todas las rutas de jueces
router.use(authenticateJWT, authorizeRoles('admin'));

// Obtener todos los jueces
router.get('/', getJueces);

// Obtener un juez por ID
router.get('/:id', getJuezById);

// Crear un nuevo juez
router.post('/', crearJuez);

// Actualizar un juez existente
router.put('/update/:id', updateJuez);

// Eliminar un juez
router.delete('/delete/:id', deleteJuez);

// Perfil de juez con su carnet
router.get('/perfil/:carnet', getPerfilJuez);

module.exports = router;
