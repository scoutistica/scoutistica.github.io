import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';
import 'rxjs/Rx';
 
@Injectable()
export class LastRoundService {

  constructor(private http: Http) { }

  lastRound(){
  	const url = '/api/lastround';
  	const options = {};
		
  	return this.http.get(url, options)
  		.map((res) => res.json())
  		.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}