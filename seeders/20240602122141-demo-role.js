'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [{
      role: 'User'
    }, {
      role: 'Admin'
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
  
};
