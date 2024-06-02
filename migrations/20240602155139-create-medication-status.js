'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medication_statuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      medication_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'medications',
          key: 'id'
        }
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        defaultValue: Sequelize.fn("NOW"),
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medication_statuses');
  }
};