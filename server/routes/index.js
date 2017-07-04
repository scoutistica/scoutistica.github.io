const roundController = require('../controllers').round;
const roundDetailedTeamScout = require('../controllers').roundDetailedTeamScoutChart;
const averageTeamScout = require('../controllers').averageTeamScoutChart;

module.exports = (app) => {
	app.get('/api', (req, res) => res.status(200).send({
		message: 'Welcome to data visualization tool for Cartola FC API!',
	}));

	app.get('/api/lastround', roundController.lastRound);
	app.get('/api/list', roundController.list);
	app.post('/api/rounddetailedteamscout', roundDetailedTeamScout.createChart);
	app.post('/api/averageteamscout', averageTeamScout.createChart);
}