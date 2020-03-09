import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { TrainJourney } from 'models/TrainJourney';
import { TrainJourneyService } from 'services/train-journey-service.service';
import { SorterService } from '../core/services/sorter.service';

@Component({
  selector: 'app-train-journey-component',
  templateUrl: './train-journey-planner.component.html',
  styleUrls: ['./train-journey-planner.component.css']
})
export class TrainJourneyComponent implements OnInit {

  // Local version of all journies from the datasource
  private trainJournies: TrainJourney[];

  // Distinct list of all stations
  private allStations: string[]

  // Deliberately set to empty to ensure the 'Travelling From/To ...' options are selected as default
  selectedDepartureStation: string = "";
  selectedDestinationStation: string = "";

  // Train Journey object to construct the text on the UI
  selectedTrainJourney: TrainJourney = null;

  // DI both the trainjourney service and the Sorter service
  constructor(
    private trainJourneyService: TrainJourneyService,
    private sorterService: SorterService
  ) { }

  // Implementation of angular oninit
  ngOnInit() {

    // Get all possible train journeys from the service
    this.trainJourneyService.getAll().subscribe((journies: TrainJourney[]) => {

      // Set local copy of train journies
      this.trainJournies = journies;

      // Sort by DepartFrom Name ASC
      this.sorterService.sort(this.trainJournies, 'DepartFrom');

      // Get a list of distinct journies by DepartFroms
      let distinctJournies = this.trainJournies.filter((journey, index, list) => {

        return list.indexOf(list.find(j => j.DepartFrom.toLowerCase() === journey.DepartFrom.toLowerCase())) === index;

      })

      /* Get a list of distinct stations
      (Currenly uses departFrom, may in future need to union DepartFrom and ArriveAt if some stations are depart or arrive only)*/
      this.allStations = distinctJournies.map(dj => dj.DepartFrom)

    });

  }

  // Clears the user's journey details and selections
  ClearJourneyDetails_OnClick() {

    this.selectedDepartureStation = '';
    this.selectedDestinationStation = '';
    this.selectedTrainJourney = null;

  }

  // Function to calculate the user's journey, direct or indirect.
  // This could be implemented inside the train journey service to abstract the complexity and make the service more reusable
  CalculateJourneyDetails() {

    // Lookup to see if it's a direct route
    let directTrainJourney = this.trainJournies.find(tj =>
      tj.DepartFrom.toLowerCase() === this.selectedDepartureStation.toLowerCase() &&
      tj.ArriveAt.toLowerCase() === this.selectedDestinationStation.toLowerCase()
    );

    // If it's a direct route, it's straightforward
    if (directTrainJourney !== undefined) {

      this.selectedTrainJourney = directTrainJourney;

    } else {

      // Gets more complicated, get all stations with the "DepartFrom" which matches our user's selection
      let firstLegJournies = this.trainJournies.filter((journey, index, array) => {
        return journey.DepartFrom.toLowerCase() === this.selectedDepartureStation.toLowerCase();
      });

      // Get all stations with the "ArriveAt" which matches our user's chosen destination
      let secondLegJournies = this.trainJournies.filter((journey, index, array) => {
        return journey.ArriveAt.toLowerCase() === this.selectedDestinationStation.toLowerCase()
          && journey.DepartFrom.toLowerCase() !== this.selectedDepartureStation;
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
      if (indirectTrainJournies.length > 1)
        this.sorterService.sort(indirectTrainJournies, 'Time');

      // Set the first object to be selected as it's the quickest/only journey
      this.selectedTrainJourney = indirectTrainJournies[0];

    }
  }

  // The Click event for the plan journey button
  PlanJourney_OnClick() {

    this.CalculateJourneyDetails();

  }

  // The drop downs' on change event Handler
  StationSelectors_OnChange() {

    // Check if the selected train journey has been invalidated by the change of departure or destination
    if (this.selectedTrainJourney !== null &&
      (this.selectedTrainJourney.ArriveAt.toLowerCase() !== this.selectedDestinationStation.toLowerCase() ||
        this.selectedTrainJourney.DepartFrom.toLowerCase() !== this.selectedDepartureStation.toLowerCase())) {

      // If the journey has been invalidated then nuke the train journey object and let the user recalculate via the button
      this.selectedTrainJourney = null;

    }

  }

  // Toggles the Departure and Destination stations
  Toggle_OnClick() {

    let tmpStation = this.selectedDepartureStation;

    this.selectedDepartureStation = this.selectedDestinationStation;
    this.selectedDestinationStation = tmpStation;

    this.selectedTrainJourney = null;

  }

  // Databound string array for the Departure Stations
  get AllDepartureStations(): string[] {

    return this.allStations.filter((station) => { return station.toLowerCase() !== this.selectedDestinationStation.toLowerCase(); });

  }

  // Databound string array for the Destination Stations
  get AllDestinationStations(): string[] {

    return this.allStations.filter((station) => { return station.toLowerCase() !== this.selectedDepartureStation.toLowerCase(); });

  }

  // Function to let us know the user can now proceed to determine their journey
  get IsReadyToDetermineJourney(): boolean {

    return (this.selectedDepartureStation !== '' && this.selectedDestinationStation !== '');

  }

  // Function to determine if we should show the toggle button
  get IsToggleVisible(): boolean {
    return (this.selectedDepartureStation !== '' || this.selectedDestinationStation !== '')
  }
}
