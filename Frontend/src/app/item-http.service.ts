import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { UserHttpService } from './user-http.service';

export interface Item{
  name: string;
  type: string;
  price: number;
  popularity: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})

export class ItemHttpService {

  public url = "http://localhost:3000";

  constructor(private Http: HttpClient, private us: UserHttpService) { }

  private handleError(err: HttpErrorResponse){
    let errMsg = '';
    if(err.error instanceof ErrorEvent){
      errMsg = `An error occurred: ${err.error.message}`;
    }
    else{
      errMsg = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errMsg);
    return throwError(() => new Error(errMsg));
  }

  private createOptions( params = {} ){
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.us.getToken(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      }),
      params: new HttpParams( {fromObject: params} )
    };
  }

  public getItemByName(name: string): Observable<Item>{
    return this.Http.get<Item>(this.url + '/menu/' + name, this.createOptions()).pipe(
      map( (data: any) => data.item[0]),
      tap( item => (console.log('Data: ' + JSON.stringify(item))) ),
      catchError(this.handleError)
    );
  }
}
