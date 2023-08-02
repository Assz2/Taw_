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

  constructor(private router: Router, private ts: TableHttpService, public us: UserHttpService, public os: OrderHttpService) { }

  ngOnInit(){
    this.getTables();
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
        //this.logout();
      }
    });
  }

  public updateFilter(event: string){
    this.filter = event;
    this.getTables();
  }
  
  goToOrder(id: number){
    this.ts.inheritedFilter = id;
    this.os.getOrders(id).subscribe({
      next: (data) => {
        (data as unknown as Order).items.forEach(itemId => {
          this.os.getItem(itemId).subscribe({
            next: (item) => {
              this.os.itemName = item.name;
              this.os.itemPrice = item.price;
              this.os.itemType = item.type;
              this.os.itemPopularity = item.popularity;
              this.os.itemDescription = item.description;
            },
            error: (err) => {
              console.log("Error: " + JSON.stringify(err));
            }
          });
        });
      },
    });
    this.router.navigate(['/orders']);
  }

  logout(){
    this.us.logout();
    this.router.navigate(['/']);
  }
}
