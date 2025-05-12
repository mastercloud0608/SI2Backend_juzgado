const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.STRING(50),
    primaryKey: true
  }
}, {
  tableName: 'rol',
  timestamps: false
});

module.exports = Rol;
