const roundModel = require('../models').Round; 
const gameModel = require('../models').Game; 
const teamModel = require('../models').Team; 
const playerModel = require('../models').Player; 
const performanceModel = require('../models').Performance;

const Sequelize = require('sequelize');

module.exports = {
	createChart(req, res){
		teamModel.findAll().then((teams) => {
      let promises = [];
      let roundAndOppTeam = [];

      for(let i = 0; i < teams.length; i++){
        let promise = new Promise(
        (resolve, reject) => {
          gameModel
            .findAll({
              where: {
                round: { $between: [req.body.startRound, req.body.endRound] },
                $or: {
                  home_team: teams[i].team_id,
                  away_team: teams[i].team_id
                }
              }
            })
            .then((games) => {
              resolve(games);
            })
            .catch((error) => {
              reject(error);
            })
        });
        promises.push(promise);
      }

      return Promise.all(promises)
        .then((games) => {
          console.log(req.body);
          console.log(req.body.endRound);
          let teamAndGames = [];
          let tupleGameOppTeam = {};
          let gamesTeam = {};
          let arrayTupleGameOppTeam = [];

          for(let i = 0; i < teams.length; i++){
            for(let j = 0; j < games[i].length; j++){
              tupleGameOppTeam = {};
              if(games[i][j].away_team == teams[i].team_id && req.body.Location != 'home'){
                tupleGameOppTeam = {
                  game: games[i][j].id,
                  oppTeam: games[i][j].home_team
                } 
              }
              else if(games[i][j].home_team == teams[i].team_id && req.body.Location != 'away'){
                tupleGameOppTeam = {
                  game: games[i][j].id,
                  oppTeam: games[i][j].away_team
                } 
              }

              if(tupleGameOppTeam.hasOwnProperty('game'))
                arrayTupleGameOppTeam.push(tupleGameOppTeam);
            }
            gamesTeam.games = arrayTupleGameOppTeam;
            gamesTeam.team = teams[i].initials;

            teamAndGames.push(gamesTeam);
            gamesTeam = {};
            arrayTupleGameOppTeam = [];
          }

          return teamAndGames;
        })
        .catch((error) => {
          return error;
        })
      })
    .then((teamAndGames) => {
      let promises = [];
      let oppList = [];

      for(let i = 0; i < teamAndGames.length; i++){
        for(let j = 0; j < teamAndGames[i].games.length; j++){
          oppList.push(teamAndGames[i].games[j].oppTeam);
        }
        let promise;
        if(req.body.Position != undefined){
          promise = new Promise(
            (resolve, reject) => {
              playerModel
                .findAll({
                  where:{
                    team_id: {
                      $in: oppList
                    },
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
                  team_id: {
                    $in: oppList
                  }
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

        oppList = [];
        promises.push(promise);
      }

      return Promise.all(promises)
        .then((players) => {
          let teamPlayers = [];
          for(let i = 0; i < teamAndGames.length; i++){
            for(let j = 0; j < teamAndGames[i].games.length; j++){
              for(let k = 0; k < players[i].length; k++){
                if(teamAndGames[i].games[j].oppTeam == players[i][k].team_id){
                  teamPlayers.push(players[i][k].player_id);
                }
              }
              teamAndGames[i].games[j].players = teamPlayers;
              teamPlayers = [];
            }
          }
          let teamAndGamesAndPlayers = teamAndGames;
          return teamAndGamesAndPlayers;
        })
        .catch((error) => {
          return error;
        })
    })
    .then((teamAndGamesAndPlayers) => {
      let promises = [];
      for(let i = 0; i < teamAndGamesAndPlayers.length; i++){
        let players = [];
        let games = [];
        
        for(let j = 0; j < teamAndGamesAndPlayers[i].games.length; j++){
          for(let k = 0; k < teamAndGamesAndPlayers[i].games[j].players.length; k++){
            players.push(teamAndGamesAndPlayers[i].games[j].players[k]);
          }
          games.push(teamAndGamesAndPlayers[i].games[j].game);
        }

        let promise = new Promise(
          (resolve, reject) => {
          performanceModel
            .findAll({
              where:{
                game_id: {
                  $in: games
                },
                player_id: {
                  $in: players
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
          let performanceRounds = [], sumScouts = 0, categories = [];
          performanceRounds.push(req.body.Scout);

          for(let i = 0; i < teamAndGamesAndPlayers.length; i++){
            for(let j = 0; j < performances[i].length; j++){
              if(req.body.Scout == 'fin')
                sumScouts += performances[i][j]['post_shot'] + performances[i][j]['miss_shot'] + performances[i][j]['saved_shot'];
              else
                sumScouts += performances[i][j].dataValues[req.body.Scout];
            }
            performanceRounds.push(sumScouts/teamAndGamesAndPlayers[i].games.length);
            categories.push(teamAndGamesAndPlayers[i].team)
            sumScouts = 0;
          }
          let chartData = {};
          chartData.performance = performanceRounds;
          chartData.categories = categories;

          res.status(200).send(chartData);
        });
    })
    .catch(error => { 
      res.status(400).send(error)
      console.log(error);
    });
	}
}