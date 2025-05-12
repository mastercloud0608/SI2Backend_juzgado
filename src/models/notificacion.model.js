// src/models/notificacion.model.js
module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define('Notificacion', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuario', key: 'id_usuario' },
    },
    mensaje: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'notificacion',
    timestamps: false
  });

  return Notificacion;
};
