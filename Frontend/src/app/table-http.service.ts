import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UserHttpService } from './user-http.service';
import jwt_decode from 'jwt-decode';


export interface Table{
  number: number;
  seats: number;
  occ: boolean;
}

@Injectable()
export class TableHttpService {

  public url = "http://localhost:3000";
  constructor(private http: HttpClient, private us: UserHttpService) { }


  public getTables(filter?: string): Observable<Table[]> {
    const url = this.url + '/tables';

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.us.getToken());

    const params = new HttpParams().set('filter', filter ? filter : '');

    return this.http.get<Table[]>(url, { headers, params }).pipe(
      tap((data: Table[]) => {
        console.log('Received tables: ' + JSON.stringify(data));
      }
    ));
  }
}
