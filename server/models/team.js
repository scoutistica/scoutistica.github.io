'use strict';

module.exports = (sequelize, Sequelize) => {
	const Team = sequelize.define('Team', {
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
	}, {
		freezeTableName: true,
		timestamps: false,
		paranoid: true,
		underscored: true,

		classMethods: {
			associate: (models) => {
				Team.hasMany(models.Player, {
					foreignKey: 'team_id',
					as: 'players'
				})
			}
		}
	});
	return Team;
};