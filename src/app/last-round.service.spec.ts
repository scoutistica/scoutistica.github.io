/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LastRoundService } from './last-round.service';

describe('LastRoundService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LastRoundService]
    });
  });

  it('should ...', inject([LastRoundService], (service: LastRoundService) => {
    expect(service).toBeTruthy();
  }));
});
