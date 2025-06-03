// src/models/documento.model.js
module.exports = (sequelize, DataTypes) => {
  const Documento = sequelize.define('Documento', {
    id_documento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    contenido: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    tipo_documento: {
      type: DataTypes.ENUM('Sentencia', 'Informe', 'Memorial', 'Resolución', 'Otro'),
      allowNull: false
    },
    fecha_subida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    firma_digital: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    id_expediente: {
      type: DataTypes.INTEGER,
      references: {
        model: 'expediente',
        key: 'id_expediente'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuario',
        key: 'id_usuario'
      }
    }
  }, {
    tableName: 'documento',
    timestamps: false,
    underscored: true
  });

  // ✅ Tus asociaciones reales deben estar aquí activas
  Documento.associate = (models) => {
    Documento.belongsTo(models.Expediente, { foreignKey: 'id_expediente', as: 'expediente' });
    Documento.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  };

  return Documento;
};
