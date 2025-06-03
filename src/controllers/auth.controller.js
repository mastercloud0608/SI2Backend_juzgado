const authService = require('../services/auth.service.js');

async function register(req, res) {
  try {
    console.log('[🔵 Registro recibido]', req.body); // <-- Log para verificar datos de entrada

    const user = await authService.register(req.body);

    console.log('[✅ Usuario creado]', user.toJSON ? user.toJSON() : user);
    res.status(201).json({ message: 'Usuario creado.', user });
  } catch (err) {
    console.error('[❌ Error en register]', err); // <-- Mostrar el error real del backend
    res.status(400).json({ error: err.message || 'Error inesperado en el registro' });
  }
}

async function login(req, res) {
  try {
    const { token, user } = await authService.login(req.body);
    const plainUser = user.toJSON ? user.toJSON() : user;
    res.json({ token, user: plainUser });
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
    res.json({ message: 'Revisa tu correo para el enlace de recuperación.', token });
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
};
