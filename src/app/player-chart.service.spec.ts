/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PlayerChartService } from './player-chart.service';

describe('PlayerChartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerChartService]
    });
  });

  it('should ...', inject([PlayerChartService], (service: PlayerChartService) => {
    expect(service).toBeTruthy();
  }));
});
