// src/models/expediente.model.js
module.exports = (sequelize, DataTypes) => {
  const Expediente = sequelize.define('Expediente', {
    id_expediente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_expediente: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_cierre: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado_actual: {
      type: DataTypes.ENUM('Abierto', 'En proceso', 'Cerrado'),
      allowNull: false,
      defaultValue: 'Abierto'
    },
    id_usuario_creador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id_usuario'
      }
    },
    id_juez_responsable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuario',
        key: 'id_usuario'
      }
    }
  }, {
    tableName: 'expediente',
    timestamps: false
  });

  Expediente.associate = (models) => {
    // asociaciones si las necesitas
  };

  return Expediente;
};
