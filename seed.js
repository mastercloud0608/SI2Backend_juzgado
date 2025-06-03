// seed.js
const bcrypt = require('bcryptjs');
const sequelize = require('./src/db');
const { Usuario, Rol } = require('./src/models');
require('dotenv').config(); // 👈 Esto carga .env antes de usar process.env


async function seed() {
  try {
    await sequelize.sync({ force: false });

    // 1. Crear roles
    const roles = [
      { id_rol: 'ADMINISTRADOR', descripcion: 'Administrador del sistema' },
      { id_rol: 'JUEZ', descripcion: 'Juez asignado a casos' },
      { id_rol: 'ABOGADO', descripcion: 'Abogado defensor o fiscal' },
      { id_rol: 'CLIENTE', descripcion: 'Ciudadano o parte involucrada' }
    ];

    for (const rol of roles) {
      await Rol.findOrCreate({
        where: { id_rol: rol.id_rol },
        defaults: { descripcion: rol.descripcion }
      });
    }

    // 2. Crear usuarios por rol
    const usuarios = [
      {
        nombre: 'Admin',
        apellido: 'General',
        correo: 'admin@gmail.com',
        password: 'admin123',
        rol: 'ADMINISTRADOR'
      },
      {
        nombre: 'Juez',
        apellido: 'Pérez',
        correo: 'juez@gmail.com',
        password: 'juez123',
        rol: 'JUEZ'
      },
      {
        nombre: 'Abogado',
        apellido: 'López',
        correo: 'abogado@gmail.com',
        password: 'abogado123',
        rol: 'ABOGADO'
      },
      {
        nombre: 'Cliente',
        apellido: 'Ramírez',
        correo: 'cliente@gmail.com',
        password: 'cliente123',
        rol: 'CLIENTE'
      }
    ];

    for (const usuario of usuarios) {
      const hash = await bcrypt.hash(usuario.password, 10);

      const [user, creado] = await Usuario.findOrCreate({
        where: { correo: usuario.correo },
        defaults: {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          password_hash: hash,
          estado_usuario: 'Activo'
        }
      });

      if (creado) {
        const rol = await Rol.findByPk(usuario.rol);
        await user.addRol(rol);
        console.log(`✅ Usuario ${usuario.rol} creado: ${usuario.correo} / ${usuario.password}`);
      } else {
        console.log(`ℹ️ Usuario ${usuario.rol} ya existe: ${usuario.correo}`);
      }
    }

    process.exit();
  } catch (err) {
    console.error('🔴 Error al insertar datos iniciales:', err);
    process.exit(1);
  }
}

seed();
