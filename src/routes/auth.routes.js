// src/routes/auth.routes.js
const express = require('express');
const router  = express.Router();

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

router.post('/register',        register);
router.post('/login',           login);
router.post('/logout',          logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

module.exports = router;
