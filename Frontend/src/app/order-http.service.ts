import { Injectable, EventEmitter } from '@angular/core';
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
  private newStatus: string;
  public currentStatus: string;

  constructor(private Http: HttpClient, private us: UserHttpService) { 
    this.newStatus = "";
    this.currentStatus = "";
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

  public updateOrderStatus(id: Number){
    this.getOrders(id).subscribe(data => {
      var i = 0;
      while(i < data.length && data[i].status != "READY"){
        this.currentStatus = data[i].status;
        i++;
      }
      
      console.log("Current status: " + this.currentStatus);


      if(this.currentStatus === "PENDING")
        this.newStatus = "QUEUE";
      else if(this.currentStatus === "QUEUE")
        this.newStatus = "READY";

      const update = {"status": this.newStatus};

      this.Http.put(this.url + '/orders/' + id, update, this.createOptions()).subscribe(
        (data) => {
          console.log("Received orders: " + JSON.stringify(data));
        },
        (error) => {
          console.log("Error: " + JSON.stringify(error));
        });
    });
  }

  public deleteOrder(ord: Order){
    this.Http.delete(this.url + '/orders/' + ord.tableId, this.createOptions()).subscribe(
      (data) => {
        console.log("Received orders: " + JSON.stringify(data));
      },
      (error) => {
        console.log("Error: " + JSON.stringify(error));
      });

    /*
    this.getOrders(id).subscribe(data => {
      data.forEach(element => {
          return this.Http.delete(this.url + '/orders/' + element.tableId, this.createOptions()).pipe(
            tap( (data) => console.log("Delete order: " + JSON.stringify(data)) ),
            catchError(this.handleError)
          );
      });
    });
    */
  }
}
