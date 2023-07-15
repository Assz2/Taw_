import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserHttpService } from './user-http.service';


export interface Table{
  number: number;
  seats: number;
  occ: boolean;
}

@Injectable()
export class TableHttpService {

  public url = "http://localhost:3000";
  constructor(private http: HttpClient, private us: UserHttpService) {
    console.log("Table service instantiated");
    console.log("User service Token: " + us.getToken());
  }

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

  getTables(filter?: string): Observable<Table[]> {
    return this.http.get<Table[]>(this.url + '/tables', this.createOptions({filter: filter})).pipe(
      map( (data: any) => data.tables),
      tap( (data) => console.log("Received tables: " + JSON.stringify(data)) ),
      catchError(this.handleError)
    );
  }
}
