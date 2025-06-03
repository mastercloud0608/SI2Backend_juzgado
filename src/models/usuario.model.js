// src/models/usuario.model.js
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    telefono: DataTypes.STRING(20),
    calle: DataTypes.STRING(150),
    ciudad: DataTypes.STRING(100),
    codigo_postal: DataTypes.STRING(20),
    estado_usuario: {
      type: DataTypes.ENUM('Activo', 'Inactivo'),
      allowNull: false,
      defaultValue: 'Activo',
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'usuario',
    timestamps: false,
  });

  // ✅ Define las asociaciones aquí
  Usuario.associate = (models) => {
    Usuario.belongsToMany(models.Rol, {
      through: models.UsuarioRol,
      foreignKey: 'id_usuario',
      otherKey: 'id_rol',
      as: 'roles',
    });

    Usuario.belongsToMany(models.Expediente, {
      through: models.ExpedienteAbogado,
      foreignKey: 'id_usuario',
      otherKey: 'id_expediente',
      as: 'expedientes',
    });

    Usuario.belongsToMany(models.Audiencia, {
      through: models.AudienciaParte,
      foreignKey: 'id_usuario',
      otherKey: 'id_audiencia',
      as: 'audiencias',
    });

    Usuario.hasMany(models.Notificacion, {
      foreignKey: 'id_usuario',
      as: 'notificaciones',
    });
  };

  return Usuario;
};
