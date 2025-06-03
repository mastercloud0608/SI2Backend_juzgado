const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { addHours } = require('date-fns');

// 👇 Importa todos los modelos correctamente desde index.js
const models = require('../models');
const { Rol, PasswordResetToken } = models;
const Usuario = models.Usuario;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '8h';

async function register({ nombre, apellido, correo, password, rol }) {
  const existing = await Usuario.findOne({ where: { correo } });
  if (existing) throw new Error('El correo ya está en uso.');

  const allowedRoles = ['cliente', 'juez', 'abogado'];
  if (!allowedRoles.includes(rol)) throw new Error('Rol no permitido.');

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Crear usuario
  await Usuario.create({
    nombre,
    apellido,
    correo,
    password_hash: hash,
    estado_usuario: 'Activo',
    fecha_registro: new Date()
  });

  // Buscar nuevamente al usuario para que tenga los métodos de asociación
  const user = await Usuario.findOne({ where: { correo } });

  const roleInstance = await Rol.findByPk(rol);
  if (!roleInstance) throw new Error('Rol no encontrado.');

  // Asociar rol
  await user.addRole(roleInstance);

  return user;
}

async function login({ correo, password }) {
  const user = await Usuario.findOne({
    where: { correo },
    include: [{ model: Rol, as: 'roles', through: { attributes: [] } }]
  });

  if (!user) throw new Error('Usuario no encontrado.');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Contraseña incorrecta.');

  const payload = { id: user.id_usuario, correo: user.correo };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

  return { token, user };
}

async function logout() {
  // Lógica si algún día agregás tokens invalidables o blacklist
  return;
}

async function forgotPassword({ correo }) {
  const user = await Usuario.findOne({ where: { correo } });
  if (!user) throw new Error('Usuario no encontrado.');

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = addHours(new Date(), 1);

  await PasswordResetToken.destroy({ where: { id_usuario: user.id_usuario } });
  await PasswordResetToken.create({ token, expiresAt, id_usuario: user.id_usuario });

  return token;
}

async function resetPassword({ token, newPassword }) {
  const record = await PasswordResetToken.findOne({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    throw new Error('Token inválido o expirado.');
  }

  const user = await Usuario.findByPk(record.id_usuario);
  if (!user) throw new Error('Usuario asociado no existe.');

  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(newPassword, salt);
  await user.save();

  await record.destroy();
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
};
