'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => 
    queryInterface.createTable('Player', {
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Team',
          key: 'id',
          as: 'team_id'
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false
      },
      initials_position: {
        type: Sequelize.STRING,
        allowNull: false
      },
      specific_position: {
        type: Sequelize.STRING
      },
      goal: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      assist: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      suffered_foul: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      committed_foul: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      miss_pass: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      miss_pk: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      miss_shot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      saved_shot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      post_shot: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      steal: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      save: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      yellow_card: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      suffered_goal: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      clean_sheet: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      red_card: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      offside: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      own_goal: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      pk_saved: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    }),
  down: (queryInterface /* , Sequelize */) => queryInterface.dropTable('Player'),
};
