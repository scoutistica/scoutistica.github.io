'use strict';
const https = require('https');

//constants
const hostName = 'api.cartolafc.globo.com';
const contentType = 'application/json; charset=utf-8';
const userAgent = 'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36';

//utils
const constants = require('./constants');
const utils = require('./utils');
const error = require('./error');

//models
const roundModel = require('../models').Round;
const gameModel = require('../models').Game;
const playerModel = require('../models').Player;
const performanceModel = require('../models').Performance;

class updateLastRound {

	constructor() {
		let self = this;
		setInterval(function() {
			const options = {
				method: 'GET',
				hostname: hostName,
				path: '/mercado/status',
				headers: {
					'User-Agent': userAgent
				}
			};

			let req = https.request(options, (res) => {
				let statusMarket = '';
				res.on('data', (d) => {
					statusMarket += d;
				});

				res.on('end', () => {
				if(res.headers['content-type'] == 'application/json;charset=UTF-8'){
					let jsonStatusMarket = JSON.parse(statusMarket);

					if(jsonStatusMarket.hasOwnProperty('rodada_atual')){
						roundModel
							.max('round')
							.then(currentRound => {
								if(jsonStatusMarket.rodada_atual > currentRound){
									self.updateRound(jsonStatusMarket.rodada_atual);
								}
								else{
									console.log("This is the current round.");
								}
							})
							.catch((e) => {
								error.errorHandler(e, 'sequelize');
							});
					}
					else
						console.log('Current round not present in JSON, cant continue.');
				}
				else
					console.log('Server error.');
				
				});
			}).on('error', (e) => {
				error.errorHandler(e, 'request');
			});
			req.end();
		}, 1000*60*60);
	}

	updateRound(nextRound){
		roundModel
			.create({
				round: nextRound
			})
			.then(() => {
				this.updateGames(nextRound);
			})
			.catch((e) => {
				error.errorHandler(e, 'sequelize');
			});
	}

	updateGames(nextRound){
		const options = {
			hostname: hostName,
			path: '/partidas',
			headers: {
				'Content-Type': contentType,
				'User-Agent': userAgent
			}
		};

		let req = https.request(options, (res) => {
			let lastGames = '';

			res.on('data', (d) => {
				lastGames += d;
			});

			res.on('end', () => {
				let jsonLastGames = JSON.parse(lastGames);
				let homeTeam = [];
				let awayTeam = [];

				for(let i = 0; i < jsonLastGames.partidas.length; i++){
					homeTeam.push(jsonLastGames.partidas[i].clube_casa_id);
					awayTeam.push(jsonLastGames.partidas[i].clube_visitante_id);
				}
				gameModel
					.bulkCreate([
						{home_team: homeTeam[0], away_team: awayTeam[0], round: nextRound},
						{home_team: homeTeam[1], away_team: awayTeam[1], round: nextRound},
						{home_team: homeTeam[2], away_team: awayTeam[2], round: nextRound},
						{home_team: homeTeam[3], away_team: awayTeam[3], round: nextRound},
						{home_team: homeTeam[4], away_team: awayTeam[4], round: nextRound},
						{home_team: homeTeam[5], away_team: awayTeam[5], round: nextRound},
						{home_team: homeTeam[6], away_team: awayTeam[6], round: nextRound},
						{home_team: homeTeam[7], away_team: awayTeam[7], round: nextRound},
						{home_team: homeTeam[8], away_team: awayTeam[8], round: nextRound},
						{home_team: homeTeam[9], away_team: awayTeam[9], round: nextRound}
					])
					.then(() => {
						this.insertNewPlayers(nextRound);
					})
					.catch((e) => {
						error.errorHandler(e, 'sequelize');
					});
			});
		}).on('error', (e) => {
			error.errorHandler(e, 'request');
		});
		req.end();
	}

	insertNewPlayers(nextRound){
		const options = {
			hostname: hostName,
			path: '/atletas/mercado',
			headers: {
				'Content-Type': contentType,
				'User-Agent': userAgent
			}
		};

		var req = https.request(options, (res) => {
			let currentStatisticsPlayer = '';

			res.on('data', (d) => {
				currentStatisticsPlayer += d;
			});

			res.on('end', (d) => {
				let jsonCurrentStatisticsPlayer = JSON.parse(currentStatisticsPlayer);
				let promises = [];
				for(let i = 0; i < jsonCurrentStatisticsPlayer.atletas.length; i++){
					let values = utils.rawJsonIntoHandledJson(jsonCurrentStatisticsPlayer.atletas[i]);

					let promise = this.createPlayer(values);
					promises.push(promise);
				}

				Promise.all(promises)
				.then((result) => {
					for(let i = 0; i < result.length; i++){
						if(typeof result[i].created != "boolean"){
							error.errorHandler(result[i].created, 'sequelize');
						}
						else
							if(result[i].created)
								console.log('Player ' + result[i].player.dataValues.name + ' successfully added.');
					}

					this.updatePerformance(nextRound, jsonCurrentStatisticsPlayer);
				});
			});

		}).on('error', (e) => {
			error.errorHandler(e, 'request');
		});
		req.end();
	}

	createPlayer(values){
		let promise;

		return promise = new Promise(
			(resolve, reject) => {
				playerModel
					.findOrCreate({
						where:
							{player_id: values.player_id},
							defaults: {
								team_id: values.team_id,
								name: values.name,
								nickname: values.nickname,
								position: values.position,
								initials_position: values.initials_position,
								specific_position: values.specific_position,
								goal: values.goal,
								assist: values.assist,
								suffered_foul: values.suffered_foul,
								committed_foul: values.committed_foul,
								miss_pass: values.miss_pass,
								miss_pk: values.miss_pk,
								saved_pk: values.saved_pk,
								miss_shot: values.miss_shot,
								saved_shot: values.saved_shot,
								post_shot: values.post_shot,
								steal: values.steal,
								save: values.save,
								yellow_card: values.yellow_card,
								suffered_goal: values.suffered_goal,
								clean_sheet: values.clean_sheet,
								red_card: values.red_card,
								offside: values.offside,
								own_goal: values.own_goal,
								pk_saved: values.pk_saved
							}
					})
					.spread((player, created) => {
						let result = {};
						result.player = player;
						result.created = created;

						resolve(result);
					})
					.catch((e) => {
						reject(e);
					})
			}
		);
	}

	updatePerformance(nextRound, jsonCurrentStatisticsPlayer){
		let insertPerformancePromises = [];

		for(let i = 0; i < jsonCurrentStatisticsPlayer.atletas.length; i++){
			let values = utils.rawJsonIntoHandledJson(jsonCurrentStatisticsPlayer.atletas[i]);

			let insertPerformancePromise = this.insertPerformance(values, nextRound);
			insertPerformancePromises.push(insertPerformancePromise);
		}

		Promise.all(insertPerformancePromises)
		.then((result) => {
			let totalPerformancesAdded = 0;
			totalPerformancesAdded = result.length;

			for(let i = 0; i < result.length; i++){
				if(typeof result[i] != "boolean"){
					error.errorHandler(result[i], 'sequelize');
					totalPerformancesAdded -= 1;
				}
			}
			console.log('Number of performances added: ' + totalPerformancesAdded);
		
			this.updatePlayer(nextRound, jsonCurrentStatisticsPlayer);
		});
	}

	insertPerformance(values, nextRound){
		let promise = [];

		return promise = new Promise(
			(resolve, reject) => {
				playerModel
					.findOne({
						where: {
							player_id: values.player_id
						}
					}).then((player) => {
						if(player != null) {
							values.goal -= player.dataValues.goal;
							values.assist -= player.dataValues.assist;
							values.save -= player.dataValues.save;
							values.suffered_foul -= player.dataValues.suffered_foul;
							values.committed_foul -= player.dataValues.committed_foul;
							values.miss_pass -= player.dataValues.miss_pass;
							values.miss_pk -= player.dataValues.miss_pk;
							values.miss_shot -= player.dataValues.miss_shot;
							values.saved_shot -= player.dataValues.saved_shot;
							values.post_shot -= player.dataValues.post_shot;
							values.steal -= player.dataValues.steal;
							values.yellow_card -= player.dataValues.yellow_card;
							values.suffered_goal -= player.dataValues.suffered_goal;
							values.clean_sheet -= player.dataValues.clean_sheet;
							values.red_card -= player.dataValues.red_card;
							values.offside -= player.dataValues.offside;
							values.own_goal -= player.dataValues.own_goal;
							values.pk_saved -= player.dataValues.pk_saved;
							values.specific_position = player.dataValues.specific_position;
						}

						return gameModel
							.findOne({
								where:{
									round: nextRound-1,
									$or: [
										{home_team: values.team_id},
										{away_team: values.team_id}
									]
								}
							});
					}).then((game) => {
						performanceModel
							.create({
								player_id: values.player_id,
								name: values.name,
								nickname: values.nickname,
								position: values.position,
								initials_position: values.position,
								specific_position: values.specific_position,
								goal: values.goal,
								assist: values.assist,
								suffered_foul: values.suffered_foul,
								committed_foul: values.committed_foul,
								miss_pass: values.miss_pass,
								miss_pk: values.miss_pk,
								miss_shot: values.miss_shot,
								saved_shot: values.saved_shot,
								post_shot: values.post_shot,
								steal: values.steal,
								save: values.save,
								yellow_card: values.yellow_card,
								suffered_goal: values.suffered_goal,
								clean_sheet: values.clean_sheet,
								red_card: values.red_card,
								offside: values.offside,
								own_goal: values.own_goal,
								pk_saved: values.pk_saved,
								game_id: game.id
							})
					})
					.then((performance) => {
						if(performance != null)
							resolve(true);
						else
							resolve(false);
					})
					.catch((e) => {
						reject(e);
					});				
			}
		);
	}

	updatePlayer(nextRound, jsonCurrentStatisticsPlayer){
		let updatePlayerPromises = [];
		for(let i = 0; i < jsonCurrentStatisticsPlayer.atletas.length; i++){
			let values = utils.rawJsonIntoHandledJson(jsonCurrentStatisticsPlayer.atletas[i]);

			let updatePlayerPromise = this.upsertPlayer(values);
			updatePlayerPromises.push(updatePlayerPromise);
		}

		Promise.all(updatePlayerPromises)
		.then((result) => {
			let totalPlayersUpdated = 0;
			totalPlayersUpdated = result.length;

			for(let i = 0; i < result.length; i++){
				if(typeof result[i] != "boolean"){
					error.errorHandler(result[i], 'sequelize');
					totalPlayersUpdated -= 1;
				}
			}
			console.log('Number of players updated: ' + totalPlayersUpdated);
		});
	}

	upsertPlayer(values){
		let promise = [];

		return promise = new Promise(
			(resolve, reject) => {
				playerModel
					.upsert({
						player_id: values.player_id,
						team_id: values.team_id,
						name: values.name,
						nickname: values.nickname,
						position: values.position,
						initials_position: values.initials_position,
						specific_position: values.specific_position,
						goal: values.goal,
						assist: values.assist,
						suffered_foul: values.suffered_foul,
						committed_foul: values.committed_foul,
						miss_pass: values.miss_pass,
						miss_pk: values.miss_pk,
						saved_pk: values.saved_pk,
						miss_shot: values.miss_shot,
						saved_shot: values.saved_shot,
						post_shot: values.post_shot,
						steal: values.steal,
						save: values.save,
						yellow_card: values.yellow_card,
						suffered_goal: values.suffered_goal,
						clean_sheet: values.clean_sheet,
						red_card: values.red_card,
						offside: values.offside,
						own_goal: values.own_goal,
						pk_saved: values.pk_saved
					})
					.then((insertOrUpdate) => {
						resolve(insertOrUpdate);
					})
					.catch((e) => {
						reject(e);
					});
			});
	}
}

module.exports = new updateLastRound();