const dotenv = require('dotenv');
const path = require('path');

// Cargar el archivo .env apropiado según NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

const app = require('./utils/app');
const sequelize = require('./db');

// ✅ IMPORTANTE: Cargar todos los modelos y relaciones
require('./models');

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la BD establecida.');

    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas con Sequelize.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No se pudo conectar a la BD o sincronizar tablas:', err);
    process.exit(1);
  }
})();
