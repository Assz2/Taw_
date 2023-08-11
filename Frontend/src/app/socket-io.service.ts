import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { UserHttpService } from './user-http.service';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  private socket: any;
  constructor(private us: UserHttpService) { }

  connect(): Observable<any>{
    this.socket = io(this.us.url);

    return new Observable((observer) => {
      this.socket.on('broadcast', (data: any) => {
        console.log("Received broadcast: " + JSON.stringify(data));
        observer.next(data);
      });

      this.socket.on('error', (err: any) => {
        console.log("Received error: " + JSON.stringify(err));
        observer.error(err);
      });

      return {
        unsubscribe(){
          this.socket.disconnect();
        }
      };
    });
  }
}
