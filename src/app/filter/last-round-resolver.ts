import { LastRoundService } from './../last-round.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router'

@Injectable()
export class LastRoundResolver implements Resolve<number> {
  
  constructor(private lastRoundService: LastRoundService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<number>|Promise<number>|number {
      return this.lastRoundService.lastRound();
  }
}