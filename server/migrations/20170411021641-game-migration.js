'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Game', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      round_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
        	model: 'Round',
        	key: 'id',
        	as: 'round_id'
        }
      },
      home_team: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      away_team: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      score_home: {
        type: Sequelize.INTEGER
      },
      score_away: {
        type: Sequelize.INTEGER
      },
  }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Game'),
};
