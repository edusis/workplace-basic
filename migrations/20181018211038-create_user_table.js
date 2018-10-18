'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', { 
      id: Sequelize.INTEGER,
      email: Sequelize.STRING,
      workplaceId : Sequelize.INTEGER
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
