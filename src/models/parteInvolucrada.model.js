// src/models/parteInvolucrada.model.js
const { DataTypes } = require('sequelize');
const sequelize      = require('../db');

const ParteInvolucrada = sequelize.define('ParteInvolucrada', {
  id_parte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // añade aquí los demás campos de la tabla parte_involucrada…
}, {
  tableName: 'parte_involucrada',
  timestamps: false
});

module.exports = ParteInvolucrada;
