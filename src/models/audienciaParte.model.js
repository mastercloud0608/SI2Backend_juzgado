// src/models/audienciaParte.model.js

module.exports = (sequelize, DataTypes) => {
  const AudienciaParte = sequelize.define('AudienciaParte', {
    id_audiencia: {
      type: DataTypes.INTEGER,
      references: {
        model: 'audiencia',
        key: 'id_audiencia'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuario',
        key: 'id_usuario'
      }
    },
    rol_en_audiencia: {
      type: DataTypes.STRING, // "juez", "abogado", "cliente", etc.
      allowNull: false
    }
  });

  return AudienciaParte;
};
