import { NgModule } from '@angular/core';

import { TrainJourneyService } from 'services/train-journey-service.service';
import { SorterService } from 'services/sorter.service';

@NgModule({
  imports: [],
  providers: [
    TrainJourneyService,
    SorterService
  ]
})
export class CoreModule { }
