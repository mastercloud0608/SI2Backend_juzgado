// src/models/index.js
const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Modelos base
const Usuario             = require('./usuario.model');
const Rol                 = require('./rol.model');
const UsuarioRol          = require('./usuarioRol.model');
const Expediente          = require('./expediente.model');
const ExpedienteAbogado   = require('./expedienteAbogado.model');
const Audiencia           = require('./audiencia.model');
const ParteInvolucrada    = require('./parteInvolucrada.model');
const Documento           = require('./documento.model');
const DocumentoVersion    = require('./documentoVersion.model');
const PasswordResetToken  = require('./passwordResetToken.model');

// Modelos definidos como funciones (requieren instanciación)
const AudienciaParte      = require('./audienciaParte.model')(sequelize, DataTypes);
const Notificacion        = require('./notificacion.model')(sequelize, DataTypes);

// =======================
// Relaciones y asociaciones
// =======================

// Usuario ↔ Rol (muchos a muchos)
Usuario.belongsToMany(Rol, {
  through: UsuarioRol,
  foreignKey: 'id_usuario',
  otherKey: 'id_rol',
  as: 'roles'
});
Rol.belongsToMany(Usuario, {
  through: UsuarioRol,
  foreignKey: 'id_rol',
  otherKey: 'id_usuario',
  as: 'usuarios'
});

// Usuario ↔ Expediente (abogados)
Usuario.belongsToMany(Expediente, {
  through: ExpedienteAbogado,
  foreignKey: 'id_usuario',
  otherKey: 'id_expediente',
  as: 'expedientes'
});
Expediente.belongsToMany(Usuario, {
  through: ExpedienteAbogado,
  foreignKey: 'id_expediente',
  otherKey: 'id_usuario',
  as: 'abogados'
});

// Expediente → Usuario (creador / juez)
Expediente.belongsTo(Usuario, { as: 'creador', foreignKey: 'id_usuario_creador' });
Expediente.belongsTo(Usuario, { as: 'juezResponsable', foreignKey: 'id_juez_responsable' });

// Audiencia → Expediente
Audiencia.belongsTo(Expediente, { as: 'expediente', foreignKey: 'expediente_id' });

// Audiencia → Usuario (juez)
Audiencia.belongsTo(Usuario, { as: 'juez', foreignKey: 'id_juez' });

// Audiencia ↔ ParteInvolucrada (tabla intermedia)
Audiencia.belongsToMany(ParteInvolucrada, {
  through: AudienciaParte,
  foreignKey: 'id_audiencia',
  otherKey: 'id_parte',
  as: 'partes'
});
ParteInvolucrada.belongsToMany(Audiencia, {
  through: AudienciaParte,
  foreignKey: 'id_parte',
  otherKey: 'id_audiencia',
  as: 'audiencias'
});

// Audiencia ↔ Usuario (tabla intermedia también)
Usuario.belongsToMany(Audiencia, {
  through: AudienciaParte,
  foreignKey: 'id_usuario',
  otherKey: 'id_audiencia',
  as: 'audiencias'
});
Audiencia.belongsToMany(Usuario, {
  through: AudienciaParte,
  foreignKey: 'id_audiencia',
  otherKey: 'id_usuario',
  as: 'usuarios'
});

// Documento → Expediente y Usuario
Documento.belongsTo(Expediente, { as: 'expediente', foreignKey: 'id_expediente' });
Documento.belongsTo(Usuario,    { as: 'usuario',    foreignKey: 'id_usuario' });

// DocumentoVersion → Documento
DocumentoVersion.belongsTo(Documento, { as: 'documento', foreignKey: 'id_documento' });

// PasswordResetToken → Usuario
PasswordResetToken.belongsTo(Usuario, {
  as: 'usuario',
  foreignKey: 'id_usuario',
  onDelete: 'CASCADE'
});

// Usuario → Notificaciones
Usuario.hasMany(Notificacion, {
  foreignKey: 'id_usuario',
  as: 'notificaciones'
});
Notificacion.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// =======================
// Exportar modelos
// =======================
module.exports = {
  sequelize,
  Usuario,
  Rol,
  UsuarioRol,
  Expediente,
  ExpedienteAbogado,
  Audiencia,
  ParteInvolucrada,
  AudienciaParte,
  Documento,
  DocumentoVersion,
  PasswordResetToken,
  Notificacion
};
