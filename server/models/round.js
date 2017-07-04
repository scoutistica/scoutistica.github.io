'use strict'

module.exports = (sequelize, Sequelize) => {
	const Round = sequelize.define('Round', {
		round: {
			type: Sequelize.INTEGER,
			allowNull: false
		}
	}, 
	{
		freezeTableName: true,
		timestamps: false,
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: (models) => {
				Round.hasMany(models.Game, {
					foreignKey: 'round',
					as: 'games'
				})
			}
		}
	});
	return Round;
};