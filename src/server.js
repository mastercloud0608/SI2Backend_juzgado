// src/server.js
require('dotenv').config();       // carga .env
const app       = require('./utils/app');
const sequelize = require('./db');

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    // 1) Autentica la conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la BD establecida.');

    // 2) Crea o ajusta tablas según tus modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas con Sequelize.');

    // 3) Arranca Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No se pudo conectar a la BD o sincronizar tablas:', err);
    process.exit(1);
  }
})();
