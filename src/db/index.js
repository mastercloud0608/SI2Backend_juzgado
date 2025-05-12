// src/db/index.js
const { Sequelize } = require('sequelize');

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host:    DB_HOST,
  port:    DB_PORT,
  dialect: 'postgres',
  logging: false,   // quita o pon true si quieres ver los SQL en consola

  // Forzar esquema público por defecto
  define: {
    schema: 'public'
  },

  // Asegura que 'public' esté antes en el search_path
  dialectOptions: {
    prependSearchPath: true
  }
});

module.exports = sequelize;
