import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { TrainJourney } from 'models/TrainJourney';
import { TrainJourneyService } from 'services/train-journey-service.service';
import { SorterService } from '../core/services/sorter.service';

@Component({
  selector: 'app-train-journey-component',
  templateUrl: './train-journey-planner.component.html'
})
export class TrainJourneyComponent implements OnInit {

  private trainJournies: TrainJourney[] = [];

  constructor(
    private trainJourneyService: TrainJourneyService,
    private sorterService: SorterService
  ) { }

  ngOnInit() {

    // Get all possible train journeys from the service, and sort them by the DepartFrom field alphabetically
    this.trainJourneyService.getAll().subscribe((journies: TrainJourney[]) => {
      this.trainJournies = journies;
      this.sorterService.sort(this.trainJournies, 'DepartFrom');
    });

  }

}
