// src/models/parteInvolucrada.model.js
module.exports = (sequelize, DataTypes) => {
  const ParteInvolucrada = sequelize.define('ParteInvolucrada', {
    id_parte: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('Demandante', 'Demandado', 'Testigo', 'Otro'),
      allowNull: false
    },
    contacto: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'parte_involucrada',
    timestamps: false
  });

  // Asociaciones (opcional si las usás)
  ParteInvolucrada.associate = (models) => {
    // ParteInvolucrada.belongsToMany(models.Audiencia, {
    //   through: models.AudienciaParte,
    //   foreignKey: 'id_parte',
    //   otherKey: 'id_audiencia',
    //   as: 'audiencias'
    // });
  };

  return ParteInvolucrada;
};
