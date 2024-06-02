'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.role.hasMany(user, {
        foreignKey: 'role_id',
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL'
      });
      user.belongsTo(models.role, {
        foreignKey: 'role_id',
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL'
      })
    }
  }
  user.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Please enter valid format of an email"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfter: {
          args: '1950-01-01',
          msg: "Date must be greater than 01-01-1950"
        }
      }
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: {
          args: 10,
          msg: "Phone number must be of length 10"
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    activation_token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token_created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
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
    hooks: {
      beforeCreate: async (user, options) => {
        const password = user.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
    },
    sequelize,
    modelName: 'user',
    paranoid: true
  });
  return user;
};