'use strict';

class errorHandler{
	constructor(){}

	errorHandler(error, typeError){
		if(typeError == 'request'){
			if(error.statusCode == 400){
				console.log('Bad request, probably malformed syntax.')
			}
			else if(error.statusCode == 401 || error.statusCode == 403){
				console.log('Needs authentication on URL: ');
			}
			else if(error.statusCode == 500 || error.statusCode == 503){
				console.log('Server down');
			}
			else
				console.log('General request error: ' + error);
		}
		else if(typeError == 'sequelize'){
			if(1){
				console.log(error);
			}
		}
	}
}

module.exports = new errorHandler();