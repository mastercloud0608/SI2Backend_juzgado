// src/services/cliente.service.js

const { Usuario, Rol, Expediente } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  listClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
  getPerfilCliente,
};

/**
 * Lista todos los usuarios que tienen el rol 'cliente'
 */
async function listClientes() {
  // 1) Buscar el rol “cliente”
  const rolCliente = await Rol.findByPk('cliente');
  if (!rolCliente) {
    throw new Error('No existe el rol "cliente" en la base de datos.');
  }

  // 2) Recuperar todos los Usuarios que tengan asociado el rol “cliente”
  const clientes = await Usuario.findAll({
    attributes: ['id_usuario', 'nombre', 'apellido', 'correo', 'telefono'],
    include: [
      {
        model: Rol,
        as: 'roles',
        where: { id_rol: 'cliente' },
        attributes: [], // no necesitamos campos del rol en la respuesta
        through: { attributes: [] },
      },
    ],
  });

  return clientes;
}

/**
 * Obtiene un solo cliente (usuario+rol) por su ID
 */
async function getCliente(id) {
  // 1) Buscamos al Usuario por PK, incluyendo solo si tiene rol 'cliente'
  const cliente = await Usuario.findOne({
    where: { id_usuario: id },
    include: [
      {
        model: Rol,
        as: 'roles',
        where: { id_rol: 'cliente' },
        attributes: [],
        through: { attributes: [] },
      },
    ],
  });

  return cliente; // si no existe o no tiene rol "cliente", devuelve null
}

/**
 * Crea un nuevo usuario y le asigna el rol 'cliente'
 * data debe incluir al menos: { nombre, apellido, correo, password_hash (texto plano), telefono?, calle?, ciudad?, codigo_postal? }
 */
async function createCliente(data) {
  // 1) Validar que no exista otro usuario con el mismo correo
  const existente = await Usuario.findOne({ where: { correo: data.correo } });
  if (existente) {
    throw new Error('El correo ya está en uso.');
  }

  // 2) Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(data.password_hash, salt);

  // 3) Crear el usuario en la tabla “usuarios”
  const nuevoUsuario = await Usuario.create({
    nombre: data.nombre,
    apellido: data.apellido,
    correo: data.correo,
    password_hash: hashed,
    telefono: data.telefono || null,
    calle: data.calle || null,
    ciudad: data.ciudad || null,
    codigo_postal: data.codigo_postal || null,
    estado_usuario: data.estado_usuario || 'Activo',    // si tu modelo lo requiere
    fecha_registro: data.fecha_registro || new Date(),  // idem
  });

  // 4) Buscar el rol 'cliente' y asociarlo
  const rolCliente = await Rol.findByPk('cliente');
  if (!rolCliente) {
    // Si no existe ese rol, eliminamos el usuario recién creado y devolvemos error
    await nuevoUsuario.destroy();
    throw new Error('El rol "cliente" no existe en la base de datos.');
  }

  // asocia el rol “cliente” al usuario
  await nuevoUsuario.addRole(rolCliente);

  return nuevoUsuario;
}

/**
 * Actualiza datos de usuario (cliente). 
 * data puede incluir: { nombre, apellido, correo, password_hash (texto plano), telefono, calle, ciudad, codigo_postal }
 */
async function updateCliente(id, data) {
  // 1) Buscar al usuario por ID e incluir sus roles
  const usuario = await Usuario.findByPk(id, {
    include: [
      {
        model: Rol,
        as: 'roles',
        through: { attributes: [] },
      },
    ],
  });
  if (!usuario) {
    return null;
  }

  // 2) Verificar que tenga rol 'cliente' antes de actualizar
  const tieneCliente = usuario.roles.some(r => 
    r.id_rol.toLowerCase() === 'cliente' || r.nombre.toLowerCase() === 'cliente'
  );
  if (!tieneCliente) {
    throw new Error('El usuario no tiene rol “cliente”. No se puede actualizar.');
  }

  // 3) Si viene nueva contraseña, la hasheamos; si no, conservamos la actual
  let nuevoHash = usuario.password_hash;
  if (data.password_hash) {
    const salt = await bcrypt.genSalt(10);
    nuevoHash = await bcrypt.hash(data.password_hash, salt);
  }

  // 4) Actualizar los campos
  await usuario.update({
    nombre: data.nombre     !== undefined ? data.nombre     : usuario.nombre,
    apellido: data.apellido !== undefined ? data.apellido : usuario.apellido,
    correo: data.correo     !== undefined ? data.correo     : usuario.correo,
    password_hash: nuevoHash,
    telefono: data.telefono || usuario.telefono,
    calle: data.calle       || usuario.calle,
    ciudad: data.ciudad     || usuario.ciudad,
    codigo_postal: data.codigo_postal || usuario.codigo_postal,
    // Agrega aquí otros campos que necesites actualizar
  });

  // 5) Asegurar que el rol 'cliente' siga presente (por si acaso se eliminó)
  const rolesActuales = await usuario.getRoles({ where: { id_rol: 'cliente' } });
  if (rolesActuales.length === 0) {
    const rolCliente = await Rol.findByPk('cliente');
    if (rolCliente) {
      await usuario.addRole(rolCliente);
    }
  }

  return usuario;
}

/**
 * Elimina el usuario (cliente) por su ID. 
 * Devuelve el usuario eliminado o null si no existe.
 */
async function deleteCliente(id) {
  // 1) Buscar al usuario
  const usuario = await Usuario.findByPk(id, {
    include: [
      {
        model: Rol,
        as: 'roles',
        through: { attributes: [] },
      },
    ],
  });
  if (!usuario) {
    return null;
  }

  // 2) Verificar que tenga rol 'cliente'
  const esCliente = usuario.roles.some(r => 
    r.id_rol.toLowerCase() === 'cliente' || r.nombre.toLowerCase() === 'cliente'
  );
  if (!esCliente) {
    throw new Error('El usuario no tiene rol “cliente”. No se puede eliminar.');
  }

  // 3) Eliminar el usuario (las filas en UsuarioRol se borrarán en cascada)
  await usuario.destroy();
  return usuario;
}

/**
 * Devuelve el perfil completo de un cliente, incluyendo sus expedientes asociados.
 * Asume que en tu modelo Usuario tienes algo como Usuario.hasMany(Expediente, { as: 'expedientes', foreignKey: 'id_cliente' })
 */
async function getPerfilCliente(id) {
  const usuario = await Usuario.findOne({
    where: { id_usuario: id },
    include: [
      {
        model: Rol,
        as: 'roles',
        where: { id_rol: 'cliente' },
        attributes: [],
        through: { attributes: [] },
      },
      {
        model: Expediente,
        as: 'expedientes', // Debe coincidir con el alias definido en tu asociación Usuario.hasMany(Expediente, { as: 'expedientes', ... })
      },
    ],
  });

  return usuario;
}
