// src/models/passwordResetToken.model.js
const { DataTypes } = require('sequelize');
const sequelize      = require('../db');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'password_reset_token',
  timestamps: false
});

module.exports = PasswordResetToken;
