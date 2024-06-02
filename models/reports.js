'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(reports, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpate:'SET NULL',
      });
      reports.belongsTo(models.user, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpate:'SET NULL',
      })
    }
  }
  reports.init({
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
    from: {
      type: DataTypes.DATE,
      allowNull:false
    },
    to: {
      type: DataTypes.DATE,
      allowNull:false
    },
    report: {
      type: DataTypes.STRING,
      allowNull:false
    },
    createdAt: {
      defaultValue:DataTypes.NOW,
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'reports',
  });
  return reports;
};