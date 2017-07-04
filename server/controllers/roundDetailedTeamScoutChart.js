const roundModel = require('../models').Round; 
const gameModel = require('../models').Game; 
const teamModel = require('../models').Team; 
const playerModel = require('../models').Player; 
const performanceModel = require('../models').Performance;

const Sequelize = require('sequelize');

module.exports = {
	createChart(req, res){
		teamModel.findOne({
			where:{
				initials: req.body.Team
			}
		})
		.then((team) => {
			roundModel
				.findAll({
					where:{
						round: {
							$between: [req.body.startRound, req.body.endRound]
						}
					}
				})
				.then((round) => {
					let promises = [];
					let roundAndOppTeam = [];
					
					for(let i = 0; i < round.length; i++){
						let promise = new Promise(
						(resolve, reject) => {
							gameModel
								.findOne({
									where: {
										round: round[i].round,
										$or: {
											home_team: team.team_id,
											away_team: team.team_id
										}
									}
								})
								.then((game) => {
									resolve(game);
								})
								.catch((error) => {
									reject(error);
								})
						});
						promises.push(promise);
					}

					return Promise.all(promises)
					.then((games) => {
						let gameAndOppTeam = [];
						for(let i = 0; i < games.length; i++){
							let tupleGameOppTeam = {};

							if(games[i].away_team == team.team_id && req.body.Location != 'home'){
								tupleGameOppTeam = {
									game: games[i].id,
									team: games[i].home_team,
									round: round[i].round
								} 
							}
							else if(games[i].home_team == team.team_id && req.body.Location != 'away'){
								tupleGameOppTeam = {
									game: games[i].id,
									team: games[i].away_team,
									round: round[i].round
								}
							}
							
							if(tupleGameOppTeam.hasOwnProperty('game'))
								gameAndOppTeam.push(tupleGameOppTeam);
						}
						return gameAndOppTeam;
					})
					.catch((error) => {
						return error;
					})
				})
				.then((gameAndOppTeam) => {
					let promises = [];
					for(let i = 0; i < gameAndOppTeam.length; i++){
						let promise;
						
						if(req.body.Position != undefined){
							promise = new Promise(
								(resolve, reject) => {
									playerModel
										.findAll({
											where:{
												team_id: gameAndOppTeam[i].team,
												specific_position: req.body.Position
											}
										})
										.then((players) => {
											resolve(players);
										})
										.catch((error) => {
											reject(error);
										});
								});
						}
						else{
							promise = new Promise(
								(resolve, reject) => {
									playerModel
										.findAll({
											where:{
												team_id: gameAndOppTeam[i].team
											}
										})
										.then((players) => {
											resolve(players);
										})
										.catch((error) => {
											reject(error);
										});
								});
						}

						promises.push(promise);
					}

					return Promise.all(promises)
						.then((players) => {
							let teamPlayers = []
							for(let i = 0; i < gameAndOppTeam.length; i++){
								for(let j = 0; j < players[i].length; j++){
									teamPlayers.push(players[i][j].player_id);
								}
								gameAndOppTeam[i].players = teamPlayers;
								teamPlayers = [];
							}

							return gameAndOppTeam;
						})
						.catch((error) => {
							return error;
						})
				})
				.then((gameAndOppTeam) => {
					let promises = [];
					for(let i = 0; i < gameAndOppTeam.length; i++){
						let promise = new Promise(
							(resolve, reject) => {
							performanceModel
								.findAll({
									where:{
										game_id: gameAndOppTeam[i].game,
										player_id: {
											$in: gameAndOppTeam[i].players
										},
										$or: {
											steal:{
												$gt:0
											},
											miss_pass:{
												$gt:0
											},
											suffered_foul:{
												$gt:0
											},
											save:{
												$gt:0
											},
											clean_sheet:{
												$gt:0
											},
											suffered_goal:{
												$gt:0
											},
										}
									}
								})
								.then((performance) => {
									resolve(performance);
								})
								.catch((error) => {
									reject(error);
								})
						});

						promises.push(promise);
					}

					Promise.all(promises)
						.then((performances) => {
							let performanceRounds = [], rounds = [], currentIndiviualsPerformanceRound = [],
							individualPerformance = [], currentPlayersRound = [], names = [], sumScouts = 0;
							performanceRounds.push(req.body.Scout);

							for(let i = 0; i < gameAndOppTeam.length; i++){
								for(let j = 0; j < performances[i].length; j++){
									if(req.body.Scout == 'fin'){
										sumScouts += performances[i][j]['post_shot'] + performances[i][j]['miss_shot'] + performances[i][j]['saved_shot'];
									}
									else{
										sumScouts += performances[i][j].dataValues[req.body.Scout];
									}

									names.push(performances[i][j].dataValues.nickname);
									individualPerformance.push(performances[i][j].dataValues[req.body.Scout]);
								}

								currentPlayersRound.push(names);
								currentIndiviualsPerformanceRound.push(individualPerformance);
								performanceRounds.push(sumScouts);
								rounds.push(gameAndOppTeam[i].round);

								sumScouts = 0;
								names = [];
								individualPerformance = [];
							}

							let chartData = {};
							chartData.performance = performanceRounds;
							chartData.categories = rounds;
							chartData.names = currentPlayersRound;
							chartData.individualPerformances = currentIndiviualsPerformanceRound;

							res.status(200).send(chartData);
						});
				})
				.catch(error => {
					res.status(400).send(error);
					console.log(error);
				});
		});
	}
}