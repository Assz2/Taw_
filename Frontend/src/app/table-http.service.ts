import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';


export interface Table{
  number: number;
  seats: number;
  occ: boolean;
}

@Injectable()
export class TableHttpService {

  public url = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  getTables(filter?: string): Observable<Table[]>{
    console.log("getTables invoked with filter: " + filter);
    const param = new HttpParams().set('filter', filter ? filter : '');
    const option = { params: param };
    return this.http.get<Table[]>(this.url + '/tables', option).pipe(
      tap((data: Table[]) => {
        console.log("Received tables: " + JSON.stringify(data));
      }
    ));
  }
}
