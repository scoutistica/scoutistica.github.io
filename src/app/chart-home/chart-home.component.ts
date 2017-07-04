import { Component, ViewEncapsulation, ChangeDetectionStrategy, EventEmitter, Output, Input, ViewChild, 
  ViewContainerRef, trigger, transition, style, animate, state } from '@angular/core';

import { ChartComponent } from '../chart/chart.component';
import { FilterComponent } from '../filter/filter.component';
import { NgProgressService } from "ng2-progressbar";

@Component({
  selector: 'app-chart-home',
  templateUrl: './chart-home.component.html',
  styleUrls: ['./chart-home.component.css'],
  animations: [
    trigger(
      'fadePanel', [
        transition(':enter', [
          animate('50ms', style({height: '*'}))
        ]),
        transition(':leave', [
          animate('50ms', style({height: 0}))
        ])
      ]
    )
  ],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ChartHomeComponent {

  showPanel: boolean = true;
  filterElements = [];
  sliderValues = [];
  positionFilter = 'position';

  constructor(private pService: NgProgressService) {
  }

  @ViewChild(ChartComponent) 
  private chart: ChartComponent;

  @ViewChild(FilterComponent) 
  private filterPanel: FilterComponent;

  searchClick(selectedParametersChart){
    this.pService.start();
    this.chart.showOrRefreshPlayerChart(selectedParametersChart);
    this.filterElements = this.filterPanel.getSelectedIndexFilter();
    this.sliderValues = this.filterPanel.getSliderValues();
    this.filterButton();
  }

  filterButton(){
    this.showPanel = !this.showPanel;
  }

  defineFilterComponent(filterType){
    this.showPanel = true;
    if(filterType == 'position'){
      this.positionFilter = 'position';
      this.chart.clearChart();
    } else if(filterType == 'noPosition'){
      this.positionFilter = 'noPosition';
      this.chart.clearChart();
    }
  }

  stopProgressBar(){
    this.pService.done();
  }
}
