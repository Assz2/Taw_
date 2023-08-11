import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderHttpService, Order } from '../order-http.service';
import { TableHttpService } from '../table-http.service';
import { UserHttpService } from '../user-http.service';
import { OrderedItemsComponent } from '../ordered-items/ordered-items.component';
import { SocketIoService } from '../socket-io.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'] 
})

export class OrderListComponent implements OnInit{
  @ViewChild(OrderedItemsComponent) orderedItems: OrderedItemsComponent;

  public orders: Order[] = [];
  public filter: Number;
  
  constructor(private router: Router, private os: OrderHttpService, private ts: TableHttpService, private us: UserHttpService, private sio: SocketIoService) { 
    this.filter = this.ts.inheritedFilter;
  }

  
  ngOnInit(){
    this.ts.inheritedFilter = -1;
    this.getOrders();
    this.sio.connect().subscribe( (data) => {
      console.log("Received broadcast: " + JSON.stringify(data));
      this.getOrders();
    });
  }

  public getOrders(id?: number){
    if(id)
      this.filter = id;
    
    this.os.getOrders(this.filter).subscribe({
      next: (data) => {
        console.log("Received orders: " + this.orders);
        if(Array.isArray(data))
          this.orders = data;
        else
          this.orders = [data];

        if(this.orders.length > 0){
          this.orders.sort((a, b) => {
            const statusOrder = { 'READY': 1, 'QUEUE': 2, 'PENDING': 3 };
            return (statusOrder[a.status] - statusOrder[b.status]);
          });
        }
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }
}
