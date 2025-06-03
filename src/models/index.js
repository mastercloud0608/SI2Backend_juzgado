const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// =======================
// Importación de modelos
// =======================

const Usuario = require('./usuario.model')(sequelize, DataTypes);
const Rol = require('./rol.model')(sequelize, DataTypes);
const UsuarioRol = require('./usuarioRol.model')(sequelize, DataTypes);
const Expediente = require('./expediente.model')(sequelize, DataTypes);
const ExpedienteAbogado = require('./expedienteAbogado.model')(sequelize, DataTypes);
const Audiencia = require('./audiencia.model')(sequelize, DataTypes);
const ParteInvolucrada = require('./parteInvolucrada.model')(sequelize, DataTypes);
const Documento = require('./documento.model')(sequelize, DataTypes);
const DocumentoVersion = require('./documentoVersion.model')(sequelize, DataTypes);
const PasswordResetToken = require('./passwordResetToken.model')(sequelize, DataTypes);
const AudienciaParte = require('./audienciaParte.model')(sequelize, DataTypes);
const Notificacion = require('./notificacion.model')(sequelize, DataTypes);

// =======================
// Inicialización del objeto de modelos
// =======================

const models = {
  sequelize,
  Usuario,
  Rol,
  UsuarioRol,
  Expediente,
  ExpedienteAbogado,
  Audiencia,
  ParteInvolucrada,
  Documento,
  DocumentoVersion,
  PasswordResetToken,
  AudienciaParte,
  Notificacion,
};

// =======================
// Inicialización de asociaciones definidas en los modelos
// =======================

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

// =======================
// Relaciones adicionales (con alias únicos)
// =======================

// Expediente → Usuario (creador / juez)
Expediente.belongsTo(Usuario, { as: 'creadorExpediente', foreignKey: 'id_usuario_creador' });
Expediente.belongsTo(Usuario, { as: 'juezResponsableExpediente', foreignKey: 'id_juez_responsable' });

// Audiencia → Expediente
Audiencia.belongsTo(Expediente, { as: 'expedienteAudiencia', foreignKey: 'expediente_id' });

// Audiencia → Usuario (juez)
Audiencia.belongsTo(Usuario, { as: 'juezAudiencia', foreignKey: 'id_juez' });

// Audiencia ↔ ParteInvolucrada
Audiencia.belongsToMany(ParteInvolucrada, {
  through: AudienciaParte,
  foreignKey: 'id_audiencia',
  otherKey: 'id_parte',
  as: 'partesAudiencia',
});

ParteInvolucrada.belongsToMany(Audiencia, {
  through: AudienciaParte,
  foreignKey: 'id_parte',
  otherKey: 'id_audiencia',
  as: 'audienciasParte',
});

// Documento → Expediente y Usuario
Documento.belongsTo(Expediente, { as: 'expedienteDocumento', foreignKey: 'id_expediente' });
Documento.belongsTo(Usuario, { as: 'usuarioDocumento', foreignKey: 'id_usuario' });

// DocumentoVersion → Documento
DocumentoVersion.belongsTo(Documento, { as: 'documentoVersionBase', foreignKey: 'id_documento' });

// PasswordResetToken → Usuario
PasswordResetToken.belongsTo(Usuario, {
  as: 'usuarioResetToken',
  foreignKey: 'id_usuario',
  onDelete: 'CASCADE',
});

module.exports = models;
