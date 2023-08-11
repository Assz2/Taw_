import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';

interface Token {
  name: string;
  role: string;
  stats?: number;
}

interface ReceivedToken {
  token: string;
}

export interface User {
  name: string;
  role: string;
  stats?: number;
  table?: number[];
};

@Injectable()
export class UserHttpService {
  private token: string = "";
  public url = "http://localhost:3000";

  constructor(private htpp: HttpClient) { 
    console.log("UserService instantiated");

    const loadedToken = localStorage.getItem('token');
    if(!loadedToken || loadedToken.length < 1){
      console.log("No token in local storage");
      this.token = "";
    } else {
      console.log("Loaded JWT from local storage");
      this.token = loadedToken as string;
    }
  }

  login(name: string, password: string, rememeber: boolean): Observable<any> {
    console.log("Login attempt from: " + name);
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(name + ':' + password),
      'cache-control': 'no-cache',
      'Content-Type': 'application/json'
    });
    const options = { headers: headers };
    return this.htpp.post<ReceivedToken>(this.url + '/login', {}, options).pipe(
      tap((data: ReceivedToken) => {
        console.log("Received token: " + data.token);
        this.token = data.token;
        if (rememeber) {
          localStorage.setItem('token', this.token);
        }
      }
    ));
  };

  logout(): void {
    console.log("Logout");
    this.token = "";
    localStorage.setItem('token', this.token as string);
  };

  register(user: User): Observable<any>{
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type': 'application/json'
      })
    };
    return this.htpp.post(this.url + '/register', user, options).pipe(
      tap((data: any) => {
        console.log("Received: " + data);
      }
    ));
  };
  

  getToken(): string {
    return this.token;
  }

  getName(): string {
    return (jwt_decode(this.token) as Token).name;
  };

  getRole(): string {
    return (jwt_decode(this.token) as Token).role;
  };

  getStats(): number {
    return (jwt_decode(this.token) as Token).stats as number;
  };

  isCashier(): boolean {
    return (jwt_decode(this.token) as Token).role === 'CASHIER';
  };
}
