'use strict'

module.exports = (sequelize, Sequelize) => {
	const Player = sequelize.define('Player', {
		player_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey:true
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
	}, 
	{
		freezeTableName: true,
		timestamps: false,
		paranoid: true,
		underscored: true,
		classMethods: {
			associate: (models) => {
				Player.hasMany(models.Performance, {
					foreignKey: 'player_id',
					as: 'performances'
				}),
				Player.belongsTo(models.Team, {
					foreignKey: 'team_id',
					onDelete: 'CASCADE'
				})
			}
		}
	});
	
	return Player;
};