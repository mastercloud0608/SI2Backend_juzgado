// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

const authenticateJWT = require('../middlewares/authenticateJWT');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Logout requiere token
router.post('/logout', authenticateJWT, logout);

module.exports = router;
