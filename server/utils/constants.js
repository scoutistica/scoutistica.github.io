class Constants {
	constructor(){}

	positionInitials(id){
		let position = ["gol", "lat", "zag", "mei", "ata", "tec"];
		return position[id-1];
	}

	positionOriginal(id){
		let position = ["Goleiro", "Lateral", "Zagueiro", "Meia", "Atacante", "Tecnico"];
		return position[id-1];
	}
}

module.exports = new Constants();