// src/controllers/auth.controller.js
const authService = require('../services/auth.service.js');
const Usuario = require('../models/usuario.model');

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'Usuario creado.', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { token, user } = await authService.login(req.body);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function logout(req, res) {
  try {
    await authService.logout();
    res.json({ message: 'Sesión cerrada.' });
  } catch (err) {
    res.status(500).json({ error: 'Error en logout.' });
  }
}

async function forgotPassword(req, res) {
  try {
    const token = await authService.forgotPassword(req.body);
    res.json({ message: 'Revisa tu correo para el enlace de recuperación.', token /* solo para pruebas */ });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    await authService.resetPassword(req.body);
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
module.exports = {
register,
  login,
  logout,
  forgotPassword,
  resetPassword,
}