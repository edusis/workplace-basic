'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', { 
      id         : {
        type         : Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey   : true
      },
      email      : Sequelize.STRING,
      workplaceId: Sequelize.STRING
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
