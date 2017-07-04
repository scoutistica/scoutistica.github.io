'use strict'

module.exports = (sequelize, Sequelize) => {
	const Game = sequelize.define('Game', {
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
		}
	}, 
	{
		freezeTableName: true,
		timestamps: false,
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: (models) => {
				Game.hasMany(models.Performance, {
					foreignKey: 'game_id',
					as: 'performances'
				}),
				Game.belongsTo(models.Round, {
					onDelete: 'CASCADE',
					foreignKey: 'id'
				})
			}
		}
	});
	return Game;
};