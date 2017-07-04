import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { LastRoundResolver } from './filter/last-round-resolver';

import { ChartHomeComponent } from './chart-home/chart-home.component'
import { HomeComponent } from './home/home.component'

const appRoutes: Routes = [
  {path: '', component: HomeComponent/*, resolve: {lastRound: LastRoundResolver}*/}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}