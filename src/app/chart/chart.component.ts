import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { LastRoundService } from './../last-round.service';
import { PlayerChartService } from '../player-chart.service';
import { TeamChartService } from '../team-chart.service';
import * as c3 from 'c3';
import * as d3 from 'd3';

@Component({
  selector: 'chart-player-component',
  templateUrl: './chart.component.html',
  styleUrls: [
  	'./chart.component.css',
  	'../../../server/utils/c3-0.4.11/c3.min.css'
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartComponent {
	playerchart:any = [];
	playerChartTitle:string = '';
	teamChartTitle:string = '';

	@Output() chartFinishedLoading = new EventEmitter();

  constructor(private playerChartService: PlayerChartService, private teamChartService: TeamChartService, private lastRoundService: LastRoundService) { }

	detectMobile() { 
		if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		}
		else {
			return false;
		}
	}

	showOrRefreshPlayerChart(chartParameters) {
		this.playerChartService.playerChart(
			chartParameters.firstRound,
			chartParameters.endRound, 
			chartParameters.team, 
			chartParameters.position,
			chartParameters.location, 
			chartParameters.scout)
		.subscribe(playerChart => {
			this.teamChartService.teamChart(
				chartParameters.firstRound,
				chartParameters.endRound, 
				chartParameters.team, 
				chartParameters.position,
				chartParameters.location,
				chartParameters.scout
			)
			.subscribe(teamChart => {
				let categories = this.buildTitlePlayerChart(chartParameters, playerChart.performance, teamChart.performance);
				let mobile = this.detectMobile();

				let chartPlayer = c3.generate({
					bindto: '#playerChart',
					data: {
						columns: [categories['player']],
						type: 'bar'
					},
					bar:{
						width: 50
					},
					axis: {
						x: {
							type: 'category',
							categories: playerChart.categories
						}
					},
					tooltip: {
						contents: function (d, defaultTitleFormat, defaultValueFormat, color){
							let tooltipText = 
							'<div class="panel panel-default"><table class="table">';
							let lengthWithoutZeroes = 0;

							for(let i = 0; i < playerChart.names[d[0].index].length; i++){
								if(playerChart.individualPerformances[d[0].index][i] > 0){
									lengthWithoutZeroes += 1;
								}
							}

							for(let i = 0; i < playerChart.names[d[0].index].length; i++){
								if(playerChart.individualPerformances[d[0].index][i] > 0){
									if(lengthWithoutZeroes > 5)
										tooltipText += '<tr style="font-size:12px;"><td>' + playerChart.names[d[0].index][i] + '</td>';
									else
										tooltipText += '<tr style="font-size:14px;"><td>' + playerChart.names[d[0].index][i] + '</td>';
									tooltipText +=  '<td>' + playerChart.individualPerformances[d[0].index][i] + '</td></tr>';
								}
							}

							tooltipText += '</table></div>';
							return tooltipText;
						}
					}
				});

				if(mobile){
					let chartTeam = c3.generate({
						bindto: '#teamChart',
						data: {
							columns: [categories['team']],
							type: 'bar'
						},
						bar:{
							width: 10
						},
						axis: {
							x: {
								type: 'category',
								categories: teamChart.categories,
								tick: {
									rotate: 45,
									multiline: false
								}
							}
						}
					});
				}
				else{
					let chartTeam = c3.generate({
						bindto: '#teamChart',
						data: {
							columns: [categories['team']],
							type: 'bar'
						},
						bar:{
							width: 50
						},
						axis: {
							x: {
								type: 'category',
								categories: teamChart.categories,
							}
						}
					});						
				}
				
				this.chartFinishedLoading.emit();
			})
		});
	}

	buildTitlePlayerChart(chartParameters, playerchart, teamChart){
		if(chartParameters.scout == 'goal'){
			this.playerChartTitle = 'Gols cedidos pelo ' + chartParameters.team + ' aos ';
			this.teamChartTitle = 'Média de gols cedidos por todos os times';
			playerchart[0] = 'Gols';
			teamChart[0] = 'Média de gols cedidos por rodada';
		}
		else if(chartParameters.scout == 'assist'){
			this.playerChartTitle = 'Assistências cedidas pelo ' + chartParameters.team + ' aos ';
			this.teamChartTitle = 'Média de assistências cedidas por todos os times';
			playerchart[0] = 'Assistências';
			teamChart[0] = 'Média de assistências cedidas por rodada';
		}
		else if(chartParameters.scout == 'fin'){
			this.playerChartTitle = 'Finalizações cedidas pelo ' + chartParameters.team + ' aos ';
			this.teamChartTitle = 'Média de finalizações cedidas por todos os times';
			playerchart[0] = 'Finalizações';
			teamChart[0] = 'Média de finalizações cedidas por rodada';
		}
		else if(chartParameters.scout == 'suffered_foul'){
			this.playerChartTitle = 'Faltas cometidas pelo ' + chartParameters.team + ' aos ';
			this.teamChartTitle = 'Média de faltas cometidas por todos os times';
			playerchart[0] = 'Faltas cometidas';
			teamChart[0] = 'Média de faltas cometidas por rodada';
		}
		else if(chartParameters.scout == 'steal'){
			this.playerChartTitle = 'Roubadas de bola cedidas pelo ' + chartParameters.team + ' aos ';
			this.teamChartTitle = 'Média de roubadas de bola cedidas por todos os times';
			playerchart[0] = 'Roubadas de bola';
			teamChart[0] = 'Média de roubadas de bola cedidas por rodada';
		}
		else if(chartParameters.scout == 'save'){
			this.playerChartTitle = 'Defesas difíceis provocadas pelo ' + chartParameters.team + ' aos ';
			this.teamChartTitle = 'Média de defesas provocadas por todos os times';
			playerchart[0] = 'Defesas';
			teamChart[0] = 'Média de defesas cedidas por rodada';
		}

		if(chartParameters.position == 'gol'){
			this.playerChartTitle += 'goleiros, '
		}
		else if(chartParameters.position == 'zag'){
			this.playerChartTitle += 'zagueiros, '
		}
		else if(chartParameters.position == 'ld'){
			this.playerChartTitle += 'laterais direito, '
		}
		else if(chartParameters.position == 'le'){
			this.playerChartTitle += 'laterais esquerdo, '
		}
		else if(chartParameters.position == 'vo'){
			this.playerChartTitle += 'volantes, '
		}
		else if(chartParameters.position == 'mo'){
			this.playerChartTitle += 'meias ofensivos, '
		}
		else if(chartParameters.position == 'ca'){
			this.playerChartTitle += 'centroavantes, '
		}
		else if(chartParameters.position == 'pt'){
			this.playerChartTitle += 'pontas, '
		}

		if(chartParameters.location == 'home'){
			this.playerChartTitle += ' dentro de casa.';
			this.teamChartTitle += ', dentro de casa.';
		}
		else if(chartParameters.location == 'away'){
			this.playerChartTitle += 'f ora de casa.';
			this.teamChartTitle += ', fora de casa.';
		}
		if(chartParameters.location == 'both'){
			this.playerChartTitle += ' dentro e fora de casa.';
			this.teamChartTitle += ', dentro e fora de casa.';
		}

		let categories = {};
		categories['team'] = teamChart;
		categories['player'] = playerchart;

		return categories;
	}

	clearChart(){
		let playerChart = document.getElementById("playerChart");
		while (playerChart.firstChild) {
				playerChart.removeChild(playerChart.firstChild);
		}

		let teamChart = document.getElementById("teamChart");
		while (teamChart.firstChild) {
				teamChart.removeChild(teamChart.firstChild);
		}

		this.playerChartTitle = '';
		this.teamChartTitle = '';
	}
}