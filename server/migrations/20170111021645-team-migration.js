'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => 
    queryInterface.createTable('Team', {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      initials: {
        type: Sequelize.STRING,
        allowNull: false
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      }
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Team'),
};
