const Round = require('../models').Round;

module.exports = {
	lastRound(req, res) {
		return Round
			.max('round')
			.then(function(data){
				res.json(data);
			})
			.catch(error => res.status(400).send(error))
	},
	list(req, res) {
		return Round
			.findAll()
			.then(round => res.status(200).send(round))
	}
};