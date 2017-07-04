import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { FilterComponent } from './filter/filter.component';
import { PlayerChartService } from './player-chart.service'
import { LastRoundService } from './last-round.service'
import { TeamChartService } from './team-chart.service';
import { NgProgressModule } from 'ng2-progressbar';
import { NouisliderModule } from 'ng2-nouislider';
import { AppRoutingModule } from './app.routing.module';
import { LastRoundResolver } from './filter/last-round-resolver';
import { ChartHomeComponent } from './chart-home/chart-home.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    FilterComponent,
    ChartHomeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgProgressModule,
    NouisliderModule,
    AppRoutingModule
  ],
  providers: [PlayerChartService, LastRoundService, TeamChartService, LastRoundResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
