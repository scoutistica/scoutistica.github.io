const constants = require('./constants');

class Utils {
	constructor(){}

	rawJsonIntoHandledJson(rawJson){
		let handledJson = {
			player_id: rawJson.atleta_id,
			name: rawJson.nome,
			nickname: rawJson.apelido,
			position: rawJson.posicao_id,
			team_id: rawJson.clube_id
		};

		if(rawJson.scout.hasOwnProperty('G'))
			handledJson.goal = rawJson.scout.G;
		else
			handledJson.goal = 0;
		if(rawJson.scout.hasOwnProperty('A'))
			handledJson.assist = rawJson.scout.A;
		else
			handledJson.assist = 0;
		if(rawJson.scout.hasOwnProperty('FS'))
			handledJson.suffered_foul = rawJson.scout.FS;
		else
			handledJson.suffered_foul = 0;
		if(rawJson.scout.hasOwnProperty('FC'))
			handledJson.committed_foul = rawJson.scout.FC;
		else
			handledJson.committed_foul = 0;
		if(rawJson.scout.hasOwnProperty('PE'))
			handledJson.miss_pass = rawJson.scout.PE;
		else
			handledJson.miss_pass = 0;
		if(rawJson.scout.hasOwnProperty('PP'))
			handledJson.miss_pk = rawJson.scout.PP;
		else
			handledJson.miss_pk = 0;
		if(rawJson.scout.hasOwnProperty('FF'))
			handledJson.miss_shot = rawJson.scout.FF;
		else
			handledJson.miss_shot = 0;
		if(rawJson.scout.hasOwnProperty('FD'))
			handledJson.saved_shot = rawJson.scout.FD;
		else
			handledJson.saved_shot = 0;
		if(rawJson.scout.hasOwnProperty('FT'))
			handledJson.post_shot = rawJson.scout.FT;
		else
			handledJson.post_shot = 0;
		if(rawJson.scout.hasOwnProperty('RB'))
			handledJson.steal = rawJson.scout.RB;
		else
			handledJson.steal = 0;
		if(rawJson.scout.hasOwnProperty('DD'))
			handledJson.save = rawJson.scout.DD;
		else
			handledJson.save = 0;
		if(rawJson.scout.hasOwnProperty('CA'))
			handledJson.yellow_card = rawJson.scout.CA;
		else
			handledJson.yellow_card = 0;
		if(rawJson.scout.hasOwnProperty('GS'))
			handledJson.suffered_goal = rawJson.scout.GS;
		else
			handledJson.suffered_goal = 0;
		if(rawJson.scout.hasOwnProperty('SG'))
			handledJson.clean_sheet = rawJson.scout.SG;
		else
			handledJson.clean_sheet = 0;
		if(rawJson.scout.hasOwnProperty('CV'))
			handledJson.red_card = rawJson.scout.CV;
		else
			handledJson.red_card = 0;
		if(rawJson.scout.hasOwnProperty('I'))
			handledJson.offside = rawJson.scout.I;
		else
			handledJson.offside = 0;
		if(rawJson.scout.hasOwnProperty('GC'))
			handledJson.own_goal = rawJson.scout.GC;
		else
			handledJson.own_goal = 0;
		if(rawJson.scout.hasOwnProperty('DP'))
			handledJson.pk_saved = rawJson.scout.DP;
		else
			handledJson.pk_saved = 0;

		handledJson.initials_position = constants.positionInitials(handledJson.position);
		handledJson.position = constants.positionOriginal(handledJson.position);

		return handledJson;
	}
}

module.exports = new Utils();