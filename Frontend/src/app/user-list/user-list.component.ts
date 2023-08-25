import { Component, OnInit } from '@angular/core';
import { UserHttpService, User } from '../user-http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  public userList: User[];
  public deleteName: string = "";

  constructor( private us: UserHttpService, private route: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  public getUsers() {
    this.us.getUsers().subscribe({
      next: (data) => {
        if (Array.isArray(data))
          this.userList = data;
        else
          this.userList = [data];
        //console.log("Received users: " + JSON.stringify(this.userList));
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }

  public deleteUser(id: string) {
    this.us.deleteUser(id).subscribe({
      next: (data) => {
        console.log("Deleted user: " + JSON.stringify(data));
        this.getUsers();
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }
}
