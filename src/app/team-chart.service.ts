import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';
import 'rxjs/Rx';

@Injectable()
export class TeamChartService {

  constructor(private http:Http) { }

  teamChart(startRound, endRound, team, position, location, scout){
  	const body = {
		startRound: startRound,
		endRound: endRound,
		Team: team,
		Position: position,
		Location: location,
		Scout: scout
  };

  	const url = '/api/averageteamscout';
  	const options = {};

  	return this.http.post(url, body, options)
  		.map((res) => res.json())
  		.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}