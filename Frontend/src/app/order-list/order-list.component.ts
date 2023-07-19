import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderHttpService, Order } from '../order-http.service';
import { TableHttpService } from '../table-http.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{

  public orders: Order[] = [];
  
  constructor(private router: Router, private os: OrderHttpService, private ts: TableHttpService) { }

  private filter: Number = this.ts.inheritedFilter;

  ngOnInit(){
    this.getOrders();
  }

  public getOrders(){
    //this.filter = this.ts.inheritedFilter;
    this.os.getOrders(this.filter).subscribe({
      next: (data) => {
        console.log("Received orders: " + this.orders);
        if(Array.isArray(data))
          this.orders = data;
        else
          this.orders = [data];
        
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        //this.logout();
      }
    });
  }
}
