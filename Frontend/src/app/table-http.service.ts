import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserHttpService } from './user-http.service';


export interface Table{
  tableId: number;                         // number
  seats: number;                          // seats
  free: boolean; 
}

@Injectable()
export class TableHttpService {

  public url = "http://localhost:3000";
  public  inheritedFilter: Number;

  constructor(private http: HttpClient, private us: UserHttpService) {
    console.log("Table service instantiated");
    this.inheritedFilter = -1;  
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

  getTables(filter: string): Observable<Table[]> {
    return this.http.get<Table[]>(this.url + '/tables', this.createOptions({free: filter})).pipe(
      map( (data: any) => data.tables),
      tap( (data) => console.log("Received tables: " + JSON.stringify(data)) ),
      catchError(this.handleError)
    );
  }
}
