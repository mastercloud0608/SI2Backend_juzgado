// src/models/rol.model.js
module.exports = (sequelize, DataTypes) => {
  const Rol = sequelize.define('Rol', {
    id_rol: {
      type: DataTypes.STRING(50),
      primaryKey: true
    }
  }, {
    tableName: 'rol',
    timestamps: false
  });

  // Asociaciones
  Rol.associate = (models) => {
    Rol.belongsToMany(models.Usuario, {
      through: models.UsuarioRol,
      foreignKey: 'id_rol',
      otherKey: 'id_usuario',
      as: 'usuarios'
    });
  };

  return Rol;
};
