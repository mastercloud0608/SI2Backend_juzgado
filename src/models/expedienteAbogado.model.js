// src/models/expedienteAbogado.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ExpedienteAbogado = sequelize.define(
  'ExpedienteAbogado', 
  {}, 
  {
    tableName: 'expediente_abogado',
    timestamps: false,
    underscored: true
  }
);

module.exports = ExpedienteAbogado;
