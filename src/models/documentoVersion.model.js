// src/models/documentoVersion.model.js
const { DataTypes } = require('sequelize');
const sequelize       = require('../db');

const DocumentoVersion = sequelize.define('DocumentoVersion', {
  id_version: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'documento',
      key: 'id_documento'
    }
  },
  numero_version: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contenido: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  fecha_version: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'documento_version',
  timestamps: false
});

module.exports = DocumentoVersion;
