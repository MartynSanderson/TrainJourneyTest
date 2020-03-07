import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IDatabaseModel } from 'interfaces/IDatabaseModel';

export abstract class BaseReadOnlyService<T extends IDatabaseModel> {

  constructor(
    protected http: HttpClient,
    protected apiEndpointUrl: string
  ) { }
   
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
  getAll(): Observable<T[]> {

    return this.http.get<T[]>(this.apiEndpointUrl)
      .pipe(
        catchError(this.handleError)
      );

  }

  // Gets the record matching the id of the genric model requested
  getById(id: number): Observable<T> {

    return this.http.get<T>(this.apiEndpointUrl + '/' + id)
        .pipe(
          catchError(this.handleError)
        );

  }
  
}
