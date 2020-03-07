import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core/core.module';

import { AppComponent } from 'components/app.component';
import { NavMenuComponent } from 'components/nav-menu/nav-menu.component';
import { HomeComponent } from 'components/home/home.component';
import { CounterComponent } from 'components/counter/counter.component';
import { FetchDataComponent } from 'components/fetch-data/fetch-data.component';
import { TrainJourneyComponent } from 'components/train-journey-planner/train-journey-planner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    TrainJourneyComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    CoreModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'train-journey-planner', component: TrainJourneyComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
