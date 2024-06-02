'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {
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
      from: {
        type: Sequelize.DATE,
        allowNull:false
      },
      to: {
        type: Sequelize.DATE,
        allowNull:false
      },
      report: {
        type: Sequelize.STRING,
        allowNull:false
      },
      createdAt: {
        defaultValue:Sequelize.fn("NOW"),
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reports');
  }
};