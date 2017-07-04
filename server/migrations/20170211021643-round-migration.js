'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => 
    queryInterface.createTable('Round', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      round: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
  }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Round'),
};
