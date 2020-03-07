export class TrainJourney{

  constructor(departFrom: string, changingAt: string[], arriveAt: string, time: number) {
    this.DepartFrom = departFrom;
    this.ChangingAt = changingAt;
    this.ArriveAt = arriveAt;
    this.Time = time
  }
  
  // The starting point of a journey
  DepartFrom: string;

  // Optional list of station/s the user will change at if the journey is not direct
  ChangingAt: string[];

  // The destination or partial destination of a journey
  ArriveAt: string;

  // The time, in minutes, of the journey between the start and end points
  Time: number;
}
