import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserHttpService } from './user-http.service';



export interface Order{ // define interface
  tableId: number;                             // table
  associatedWaiter: string;                    // associated waiter
  items: string[];                             // items
  status: string;                              // status
  total: number;                              // total
  timeStamp: Date;                             // timeStamp 
}

export interface Item{
  name: string;
  type: string;
  price: number;
  popularity: number;
  description: string;
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



  getOrders(filter: Number): Observable<Order[]> {
    if(filter == -1){
      return this.Http.get<Order[]>(this.url + '/orders', this.createOptions()).pipe(
        map( (data: any) => data.orders),
        tap( (data) => console.log("Received orders: " + JSON.stringify(data)) ),
        catchError(this.handleError)
      );
    }
    else{
      return this.Http.get<Order[]>(this.url + '/orders', this.createOptions( {tb: filter} )).pipe(
        map( (data: any) => data.orders),
        tap( (data) => console.log("Received orders: " + JSON.stringify(data)) ),
        catchError(this.handleError)
      );
    }
  }

  public postOrder(order: {}){
    //i want to pass an array of items through the request body
    console.log("Order: " + JSON.stringify(order));
    return this.Http.post(this.url + '/orders', order, this.createOptions()).pipe(
      tap( (data) => console.log("Received orders: " + JSON.stringify(data)) ),
      catchError(this.handleError)
    );
  }

}
