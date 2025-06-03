// src/models/expedienteAbogado.model.js
module.exports = (sequelize, DataTypes) => {
  const ExpedienteAbogado = sequelize.define(
    'ExpedienteAbogado',
    {}, // sin atributos, porque es tabla intermedia pura
    {
      tableName: 'expediente_abogado',
      timestamps: false,
      underscored: true,
    }
  );

  // Asociaciones si querés (opcional)
  ExpedienteAbogado.associate = (models) => {
    // ejemplo si lo necesitás
    // models.Usuario.belongsToMany(models.Expediente, {
    //   through: ExpedienteAbogado,
    //   foreignKey: 'id_usuario',
    //   otherKey: 'id_expediente',
    //   as: 'expedientes',
    // });
  };

  return ExpedienteAbogado;
};
