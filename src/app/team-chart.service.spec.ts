/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TeamChartService } from './team-chart.service';

describe('TeamChartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamChartService]
    });
  });

  it('should ...', inject([TeamChartService], (service: TeamChartService) => {
    expect(service).toBeTruthy();
  }));
});
