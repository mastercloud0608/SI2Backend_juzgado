// src/services/auth.service.js
const bcrypt               = require('bcryptjs');
const jwt                  = require('jsonwebtoken');
const crypto               = require('crypto');
const { addHours }         = require('date-fns');
const { Usuario, Rol, PasswordResetToken } = require('../models');
;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '8h';

async function register({ nombre, apellido, correo, password }) {
  // 1) Verificar que no exista el correo
  const existing = await Usuario.findOne({ where: { correo } });
  if (existing) throw new Error('El correo ya está en uso.');

  // 2) Crear el usuario
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await Usuario.create({ nombre, apellido, correo, password_hash: hash });

  // 3) Asignar rol por defecto "Funcionario"
  const defaultRole = await Rol.findByPk('Funcionario');
  if (defaultRole) {
    // Sequelize genera el método mágico addRol() por la relación belongsToMany
    await user.addRol(defaultRole);
  }

  return user;
}

async function login({ correo, password }) {
  const user = await Usuario.findOne({ where: { correo } });
  if (!user) throw new Error('Usuario no encontrado.');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Contraseña incorrecta.');

  const payload = { id: user.id_usuario, correo: user.correo };
  const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  return { token, user };
}

// Logout (sin black-list, el cliente solo descarta el token)
async function logout() {
  return;
}

async function forgotPassword({ correo }) {
  const user = await Usuario.findOne({ where: { correo } });
  if (!user) throw new Error('Usuario no encontrado.');

  // Generar token único y fecha de expiración
  const token     = crypto.randomBytes(32).toString('hex');
  const expiresAt = addHours(new Date(), 1);

  // Eliminar tokens previos y crear uno nuevo
  await PasswordResetToken.destroy({ where: { id_usuario: user.id_usuario } });
  await PasswordResetToken.create({ token, expiresAt, id_usuario: user.id_usuario });

  // (Aquí podrías enviar un email con el enlace de recuperación)
  return token;
}

async function resetPassword({ token, newPassword }) {
  const record = await PasswordResetToken.findOne({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    throw new Error('Token inválido o expirado.');
  }

  const user = await Usuario.findByPk(record.id_usuario);
  if (!user) throw new Error('Usuario asociado no existe.');

  // Actualizar la contraseña
  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(newPassword, salt);
  await user.save();

  // Borrar el token una vez usado
  await record.destroy();
}

  module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
