import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IDatabaseModel } from 'interfaces/IDatabaseModel'; 

export class TrainService<> extends BaseReadOnlyService<T> {

  constructor(
    protected http: HttpClient,
    protected apiEndpointUrl: string
  ) {
      super(http, apiEndpointUrl);
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

  // Inserts or Updates the generic model provided
  save(model: T): Observable<T> {

    if (model.id) {
      return this.http.put<T>(this.apiEndpointUrl + '/' + model.id, model)
        .pipe(
          catchError(this.handleError)
        );
    } else {
      return this.http.post<T>(this.apiEndpointUrl, model)
        .pipe(
          catchError(this.handleError)
        );
    }
  }

  // Deletes the generic model matching the id provided
  delete(id: number): Observable<void> {

      return this.http.delete<void>(this.apiEndpointUrl + '/' + id)
      .pipe(
        catchError(this.handleError)
      );

  }

}
