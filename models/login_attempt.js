'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class login_attempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(login_attempt, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpdate:'SET NULL'
      })
      login_attempt.belongsTo(models.user, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpdate:'SET NULL'
      })
    }
  }
  login_attempt.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'login_attempt',
  });
  return login_attempt;
};