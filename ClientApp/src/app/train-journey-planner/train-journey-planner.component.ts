import { Component } from '@angular/core';

@Component({
  selector: 'app-train-journey-component',
  templateUrl: './train-journey-planner.component'
})
export class TrainJourneyComponent {


  public currentCount = 0;

  public incrementCounter() {
    this.currentCount++;
  }
}
