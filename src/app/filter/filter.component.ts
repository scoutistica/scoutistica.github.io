import { LastRoundService } from './../last-round.service';
import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, EventEmitter, Output, Input,
          trigger, transition, style, animate, state } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ChartComponent } from './../chart/chart.component';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: [
    './filter.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('shrinkOut', [
      state('in', style({height: '*'})),
      transition('* => void', [
        style({height: '*'}),
        animate(200, style({width: 0}))
      ])
    ])
  ]
})
export class FilterComponent implements OnInit {
  showAlertSelectColumn:boolean = false;
  isClicked: boolean[] = [];
  isNotClicked: boolean[] = [];
  highlights: boolean[] = [];
  team:string[] = [];
  location:string[] = [];
  position:string[] = [];
  scout:string[] = [];
  
  @Input() positionFilter:string = 'position';
  @Input() filterElements = [];
  @Input() sliderValues: any;
  @Output() onSearchClick = new EventEmitter();
  @Output() onViewInit = new EventEmitter();

  sliderConfig: any;

  constructor(private route: ActivatedRoute, private lastRoundService: LastRoundService){}

  cleanArray(number, type){
    switch(type){
      case 'team':
        for(let i = 0; i < 20; i++){
          this.isClicked[i] = false;
          this.isNotClicked[i] = true;
        }
        break;
      case 'location':
        for(let i = 20; i < 30; i++){
          this.isClicked[i] = false;
          this.isNotClicked[i] = true;
        }
        break;
      case 'position':
        for(let i = 30; i < 40; i++){
          this.isClicked[i] = false;
          this.isNotClicked[i] = true;
        }
        break;
      case 'scout':
        for(let i = 40; i < 100; i++){
          this.isClicked[i] = false;
          this.isNotClicked[i] = true;
        }
        break;
    }
  }

  highlightButtonFilter(number, type){
    this.cleanArray(number, type);
    this.isClicked[number] = true;
    this.isNotClicked[number] = false;
    this.highlights[type] = true;
    this.showAlertSelectColumn = false;
  }

  initializeArray(){
    this.team[0] = 'ATG';
    this.team[1] = 'AVA';
    this.team[2] = 'BAH';
    this.team[3] = 'BOT';
    this.team[4] = 'CAM';
    this.team[5] = 'CAP';
    this.team[6] = 'CHA';
    this.team[7] = 'COR';
    this.team[8] = 'CRU';
    this.team[9] = 'CTB';
    this.team[10] = 'FLA';
    this.team[11] = 'FLU';
    this.team[12] = 'GRE';
    this.team[13] = 'PAL';
    this.team[14] = 'PON';
    this.team[15] = 'SAN';
    this.team[16] = 'SAO';
    this.team[17] = 'SPT';
    this.team[18] = 'VAS';
    this.team[19] = 'VIT';

    this.location[20] = 'home';
    this.location[21] = 'away';
    this.location[22] = 'both';

    this.position[30] = 'gol';
    this.position[31] = 'zag';
    this.position[32] = 'le';
    this.position[33] = 'ld';
    this.position[34] = 'mo';
    this.position[35] = 'vo';
    this.position[36] = 'ca';
    this.position[37] = 'pt';

    this.scout[40] = 'fin';
    this.scout[41] = 'suffered_foul';
    this.scout[42] = 'assist';
    this.scout[43] = 'goal';
    this.scout[44] = 'steal';
    this.scout[45] = 'save';
  }

  ngOnInit() {
    let max:any;
    max = 100;

    this.route.data.subscribe(info => {
      let lastRound = info["lastRound"] - 1;
      
      this.sliderConfig = {
        behaviour: 'drag',
        connect: true,
        margin: 1,
        step: 1,
        range: {
          min: 1,
          max: lastRound
        },
        pips: {
          mode: 'steps',
          density: 5
        }
      };

      if(!this.sliderValues.length)
        this.sliderValues = [lastRound - 6, lastRound];
    });

    for(let i = 0; i < max; i++){
      this.isClicked[i] = false;
      this.isNotClicked[i] = true;
    }

    this.initializeArray();

    this.highlights['team'] = false;
    this.highlights['location'] = false;
    this.highlights['position'] = false;
    this.highlights['scout'] = false;

    this.setSelectedFilter(this.filterElements);
  }

  getSelectedFilter(){
    let i = 0;
    let selectedParameters = [];

    for(i = 0; i < 20; i++){
      if(this.isClicked[i] == true){
        selectedParameters['team'] = this.team[i];
      }
    }
    for(i = 20; i < 30; i++){
      if(this.isClicked[i] == true){
        selectedParameters['location'] = this.location[i];
      }
    }
    for(i = 30; i < 40; i++){
      if(this.isClicked[i] == true && this.positionFilter == 'position'){
        selectedParameters['position'] = this.position[i];
      }
    }
    for(i = 40; i < 100; i++){
      if(this.isClicked[i] == true){
        selectedParameters['scout'] = this.scout[i];
      }
    }

    return selectedParameters;
  }

  getSelectedIndexFilter(){
    let i = 0;
    let selectedParameters = [];

    for(i = 0; i < 20; i++){
      if(this.isClicked[i] == true){
        selectedParameters['team'] = i;
      }
    }
    for(i = 20; i < 30; i++){
      if(this.isClicked[i] == true){
        selectedParameters['location'] = i;
      }
    }
    for(i = 30; i < 40; i++){
      if(this.isClicked[i] == true){
        selectedParameters['position'] = i;
      }
    }
    for(i = 40; i < 100; i++){
      if(this.isClicked[i] == true){
        selectedParameters['scout'] = i;
      }
    }

    return selectedParameters;
  }

  getSliderValues(){
    return this.sliderValues;
  }

  setSliderValues(values){
    this.sliderValues = values;
  }

  setSelectedFilter(filterElements){
    if(filterElements.hasOwnProperty('team')){
      this.isClicked[filterElements['team']] = true;
      this.isNotClicked[filterElements['team']] = false;
      this.isClicked[filterElements['location']] = true;
      this.isNotClicked[filterElements['location']] = false;
      this.isClicked[filterElements['position']] = true;
      this.isNotClicked[filterElements['position']] = false;
      this.isClicked[filterElements['scout']] = true;
      this.isNotClicked[filterElements['scout']] = false;

      this.highlights['team'] = true;
      this.highlights['location'] = true;
      this.highlights['position'] = true;
      this.highlights['scout'] = true;

      this.showAlertSelectColumn = false;
    }
  }

  retrieveChart(){
    if(this.positionFilter == 'position'){
      if(this.highlights['team'] == true &&
       this.highlights['location'] == true &&
       this.highlights['scout'] == true &&
       this.highlights['position'] == true
      ) {
        this.showAlertSelectColumn = false;
        let selectedParameters = this.getSelectedFilter();
        selectedParameters['firstRound'] = this.sliderValues[0];
        selectedParameters['endRound'] = this.sliderValues[1];
        this.onSearchClick.emit(selectedParameters);
      }
      else {
        this.showAlertSelectColumn = true;
      }
    }
    else{
      if(this.highlights['team'] == true &&
       this.highlights['location'] == true &&
       this.highlights['scout'] == true
      ){
        this.showAlertSelectColumn = false;
        let selectedParameters = this.getSelectedFilter();
        selectedParameters['firstRound'] = this.sliderValues[0];
        selectedParameters['endRound'] = this.sliderValues[1];
        this.onSearchClick.emit(selectedParameters);
      }
      else {
        this.showAlertSelectColumn = true;
      }
    }
  }
}