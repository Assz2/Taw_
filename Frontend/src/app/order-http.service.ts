import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserHttpService } from './user-http.service';



export interface Item{ 
  name: string;                              
  type: string;                               
  price: number;                              
  description?: string;                        
}

@Injectable()
export class OrderHttpService {

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

  getOrders(filter: string): Observable<any[]> {
    return this.Http.get<any[]>(this.url + '/orders', this.createOptions({tb: filter})).pipe(
      map( (data: any) => data.orders),
      tap( (data) => console.log("Received orders: " + JSON.stringify(data)) ),
      catchError(this.handleError)
    );
  }
}
