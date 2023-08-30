import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TableHttpService, Table } from '../table-http.service';
import { UserHttpService } from '../user-http.service';
import { OrderHttpService, Order } from '../order-http.service';

import { TableEditorComponent } from '../table-editor/table-editor.component';


@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  
  public tables: Table[] = [];
  private filter: string = "";
  public userRole: string;

  constructor(private router: Router, private ts: TableHttpService, public us: UserHttpService, public os: OrderHttpService) { }

  ngOnInit(){
    this.getTables();
    this.userRole = this.us.getRole();
  }

  public getTables(){
    this.ts.getTables(this.filter).subscribe({
      next: (data) => {
        if(Array.isArray(data))
          this.tables = data;
        else
          this.tables = [data];
        console.log("Received tables: " + this.tables);
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.logout();
      }
    });
  }

  public updateFilter(event: string){
    this.filter = event;
    this.getTables();
  }

  goToOrder(id: number){
    this.ts.inheritedFilter = id;
    this.router.navigate(['/orders']);
  }

  deleteTable(id: number){
    this.ts.deleteTable(id).subscribe({
      next: (data) => {
        console.log("Deleted table: " + JSON.stringify(data));
        this.getTables();
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.logout();
      }
    });
  }

  routeAddTable(){
    this.router.navigate(['/addtb']);
  }

  logout(){
    this.us.logout();
    this.router.navigate(['/']);
  }
}
