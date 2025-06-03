// src/models/passwordResetToken.model.js
module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id_usuario'
      }
    }
  }, {
    tableName: 'password_reset_token',
    timestamps: false
  });

  PasswordResetToken.associate = (models) => {
    PasswordResetToken.belongsTo(models.Usuario, {
      as: 'usuario',
      foreignKey: 'id_usuario',
      onDelete: 'CASCADE'
    });
  };

  return PasswordResetToken;
};
