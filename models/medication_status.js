'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medication_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(medication_status,{
        foreignKey:'user_id',
        onDelete:'SET NULL',
        onUpdate:'SET NULL'
      })
      medication_status.belongsTo(models.user,{
        foreignKey:'user_id',
        onDelete:'SET NULL',
        onUpdate:'SET NULL'
      })
      models.medication.hasMany(medication_status,{
        foreignKey:'medication_id',
        onDelete:'SET NULL',
        onUpdate:'SET NULL'
      })
      medication_status.belongsTo(models.medication,{
        foreignKey:'medication_id',
        onDelete:'SET NULL',
        onUpdate:'SET NULL'
      })
    }
  }
  medication_status.init({
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
    medication_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'medications',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull:false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue:false
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
    modelName: 'medication_status',
  });
  return medication_status;
};