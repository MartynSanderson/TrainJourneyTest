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

  // local version of all journies
  private trainJournies: TrainJourney[] = [];

  // Distinct list of all stations
  private allStations: string[]

  // Distinct list of all stations once a departure station has been selected
  private allDestinationStations: string[];

  // Deliberately set to empty to ensure the 'Travelling From/To ...' options are selected as default
  selectedDepartFrom: string = "";
  selectedArriveAt: string = "";

  // Train Journey object to construct the text on the UI
  selectedTrainJourney: TrainJourney;

  // DI both the trainjourney service and the Sorter service
  constructor(
    private trainJourneyService: TrainJourneyService,
    private sorterService: SorterService
  ) { }

  ngOnInit() {

    // Get all possible train journeys from the service, and sort them by the DepartFrom field alphabetically
    this.trainJourneyService.getAll().subscribe((journies: TrainJourney[]) => {

      // Get train journies
      this.trainJournies = journies;

      // Sort by DepartFrom Name ASC
      this.sorterService.sort(this.trainJournies, 'DepartFrom');

      // Get a list of distinct journies by DepartFroms
      let distinctJournies = this.trainJournies.filter((journey, index, list) => {

        return list.indexOf(list.find(j => j.DepartFrom.toLowerCase() === journey.DepartFrom.toLowerCase())) === index;

      })

      // Get a list of distinct stations (Currenly uses departFrom, my in future need to union DepartFrom and ArriveAt)
      this.allStations = distinctJournies.map(dj => dj.DepartFrom)

    });

  }

  // Event Handler for the DepartFrom Select Box
  DepartFromOnChange() {

    // Get a list of all destination train stations which are not also the departure station
    this.allDestinationStations = this.allStations.filter((station) => {
      return station.toLowerCase() !== this.selectedDepartFrom.toLowerCase();
    });

  }

  // Event Handler for the ArriveAt Select box change
  ArriveAtOnChange() {

    // Lookup to see if it's a direct route
    let directTrainJourney = this.trainJournies.find(tj =>
      tj.DepartFrom.toLowerCase() === this.selectedDepartFrom.toLowerCase() &&
      tj.ArriveAt.toLowerCase() === this.selectedArriveAt.toLowerCase()
    );

    // If it's a direct route, it's straightforward
    if (directTrainJourney !== undefined) {

      this.selectedTrainJourney = directTrainJourney;

    } else {

      // Gets more complicated, get all stations with the "DepartFrom" which matches our user's selection
      let firstLegJournies = this.trainJournies.filter((journey, index, array) => {
        return journey.DepartFrom.toLowerCase() === this.selectedDepartFrom.toLowerCase();
      });

      // Get all stations with the "ArriveAt" which matches our user's chosen destination
      let secondLegJournies = this.trainJournies.filter((journey, index, array) => {
        return journey.ArriveAt.toLowerCase() === this.selectedArriveAt.toLowerCase()
          && journey.DepartFrom.toLowerCase() !== this.selectedDepartFrom;
      });

      // Set up an array for the indirect journey/s
      let indirectTrainJournies: TrainJourney[] = [];

      // Loop through each first leg
      firstLegJournies.forEach((fl) => {

        // Get any second leg journey where the departFrom matches the ArriveFrom of the first leg
        let secondLegMatch = secondLegJournies.find(sl => sl.DepartFrom.toLowerCase() === fl.ArriveAt.toLowerCase());

        // Add the journey as an indirect train journey using the summed times
        if (secondLegMatch !== undefined) {
          let changingAt: string[] = [fl.ArriveAt]
          indirectTrainJournies.push(new TrainJourney(fl.DepartFrom, changingAt, secondLegMatch.ArriveAt, fl.Time + secondLegMatch.Time))
        }
      });

      // Order by time taken if required
      if(indirectTrainJournies.length > 1)
        this.sorterService.sort(indirectTrainJournies, 'Time');

      // Set the first object to be selected as it's the quickest/only journey
      this.selectedTrainJourney = indirectTrainJournies[0];

    }

  }

  // Clears the users' selections
  ClearSelection() {

    this.selectedDepartFrom = "";
    this.selectedArriveAt = "";
    this.selectedTrainJourney = null;
  }

  // Toggles the stations
  ToggleDepartureAndDestinationStations() {



  }

}
