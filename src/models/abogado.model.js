// src/models/abogado.model.js

module.exports = (sequelize, DataTypes) => {
  const Abogado = sequelize.define(
    'Abogado',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carnet_identidad: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Si quisieras más campos (p.ej. teléfono, dirección, etc.), agrégalos aquí:
      // telefono: { type: DataTypes.STRING, allowNull: true },
      // direccion: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: 'abogados', // Nombre exacto de la tabla en la base de datos
      timestamps: false,     // Si tu tabla no tiene createdAt/updatedAt; en caso contrario, pon true
    }
  );

  // Aquí podrías definir asociaciones si lo necesitas:
  // Por ejemplo, si en Expediente tienes campos abogado_demandante_carnet y abogado_demandado_carnet
  // Abogado.associate = (models) => {
  //   Abogado.hasMany(models.Expediente, {
  //     as: 'expedientesDemandante',
  //     foreignKey: 'abogado_demandante_carnet',
  //     sourceKey: 'carnet_identidad'
  //   });
  //   Abogado.hasMany(models.Expediente, {
  //     as: 'expedientesDemandado',
  //     foreignKey: 'abogado_demandado_carnet',
  //     sourceKey: 'carnet_identidad'
  //   });
  // };

  return Abogado;
};
