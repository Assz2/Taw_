import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableHttpService, Table } from '../table-http.service';
import { UserHttpService } from '../user-http.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  
  public tables: Table[] = [];
  constructor(private router: Router, private ts: TableHttpService, public us: UserHttpService) { }

  ngOnInit(){
    this.getTables();
  }

  public getTables(filter?: string){
    this.ts.getTables(filter).subscribe({
      next: (data) => {
        if(Array.isArray(data))
          this.tables = data;
        else
          this.tables = [data];
        console.log("Received tables: " + this.tables);
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        //this.logout();
      }
    });
  }

  logout(){
    this.us.logout();
    this.router.navigate(['/']);
  }
}
