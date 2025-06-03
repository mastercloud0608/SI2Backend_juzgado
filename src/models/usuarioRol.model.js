// src/models/usuarioRol.model.js
module.exports = (sequelize, DataTypes) => {
  const UsuarioRol = sequelize.define('UsuarioRol', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'usuario',
        key: 'id_usuario'
      },
      onDelete: 'CASCADE'
    },
    id_rol: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      references: {
        model: 'rol',
        key: 'id_rol'
      },
      onDelete: 'RESTRICT'
    }
  }, {
    tableName: 'usuario_rol',
    timestamps: false
  });

  return UsuarioRol;
};
