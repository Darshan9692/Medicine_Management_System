'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(medication, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpate:'SET NULL',
      })
      medication.belongsTo(models.user, {
        foreignKey: 'user_id',
        onDelete:'SET NULL',
        onUpate:'SET NULL',
      })
    }
  }
  medication.init({
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
    medicine_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    medication_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    recurring_type: {
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue("recurring_type");
        return value.toLowerCase();
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      defaultValue: DataTypes.NOW,
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'medication',
    paranoid: true
  });
  return medication;
};