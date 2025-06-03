// src/models/audiencia.model.js
module.exports = (sequelize, DataTypes) => {
  const Audiencia = sequelize.define(
    'Audiencia',
    {
      id_audiencia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_expediente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'expediente',
          key: 'id_expediente',
        },
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duracion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ubicacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM('Pendiente', 'Realizada', 'Cancelada'),
        allowNull: false,
        defaultValue: 'Pendiente',
      },
      id_juez: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'usuario',
          key: 'id_usuario',
        },
      },
      observacion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'audiencia',
      timestamps: false,
    }
  );

  // Si querés agregar asociaciones
  Audiencia.associate = (models) => {
    // Ejemplo:
    // Audiencia.belongsTo(models.Usuario, { foreignKey: 'id_juez', as: 'juez' });
  };

  return Audiencia;
};
