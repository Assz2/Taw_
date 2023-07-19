import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderHttpService, Item } from '../order-http.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{

  public orders: Item[] = [];
  private filter: string = "";
  constructor(private router: Router, private os: OrderHttpService) { }

  ngOnInit(){
    this.getOrders();
  }

  public getOrders(){
    this.os.getOrders(this.filter).subscribe({
      next: (data) => {
        if(Array.isArray(data))
          this.orders = data;
        else
          this.orders = [data];
        console.log("Received orders: " + this.orders);
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        //this.logout();
      }
    });
  }
}
