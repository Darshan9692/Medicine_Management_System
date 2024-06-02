'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(user_device, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpate:'SET NULL',
      });
      user_device.belongsTo(models.user, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpate:'SET NULL',
      })
    }
  }
  user_device.init({
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
        model: "users",
        key: 'id'
      }
    },
    device_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_loggedIn: {
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
    modelName: 'user_device',
  });
  return user_device;
};