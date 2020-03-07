import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { TrainJourney } from 'models/TrainJourney' 

@Injectable()
export class TrainJourneyService {

  private readonly apiEndpointUrl: string

  constructor(
    protected http: HttpClient,
    @Inject('BASE_URL') baseUrl: string
  ) {
    // Construct readonly api end point for this service
    this.apiEndpointUrl = baseUrl + 'assets/RailwayStations.json'
  }
   
  handleError(error: any) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
      const errMessage = error.error.message;
      return Observable.throw(errMessage);
      // Use the following instead if using lite-server
      // return Observable.throw(err.text() || 'backend server error');
    }
    return Observable.throw(error || 'Node.js server error');
  }

  // Get all the records for the type of generic model passed in
  getAll(): Observable<TrainJourney[]> {

    return this.http.get<TrainJourney[]>(this.apiEndpointUrl)
      .pipe(
        catchError(this.handleError)
      );

  }

}
