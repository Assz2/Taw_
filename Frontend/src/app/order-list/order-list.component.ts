import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderHttpService, Order } from '../order-http.service';
import { TableHttpService } from '../table-http.service';
import { UserHttpService } from '../user-http.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{

  public orders: Order[] = [];
  public filter: Number;

  
  public itemName: string = "";
  public itemPrice: number = 0;
  public itemType: string = "";
  public itemPopularity: number = 0;
  public itemDescription: string = "";
  
  
  
  constructor(private router: Router, private os: OrderHttpService, private ts: TableHttpService, private us: UserHttpService) { 
    this.filter = this.ts.inheritedFilter;
  }

  
  ngOnInit(){
    this.ts.inheritedFilter = -1;
    this.getOrders();
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

  public getItem(id: string){
    this.os.getItem(id).subscribe({
      next: (data) => {
        this.itemName = data.name;
        this.itemPrice = data.price;
        this.itemType = data.type;
        this.itemPopularity = data.popularity;
        this.itemDescription = data.description;
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }
/*
  public getItemName(id: string){
    return this.os.getItem(id).subscribe({
      next: (data) => {
        this.itemName = data.name;
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }

  public getItemPrice(id: string){
    return this.os.getItem(id).subscribe({
      next: (data) => {
        return data.price;
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }

  public getItemType(id: string){
    return this.os.getItem(id).subscribe({
      next: (data) => {
        data.type;
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }

  public getItemPopularity(id: string){
    return this.os.getItem(id).subscribe({
      next: (data) => {
        return data.popularity;
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }

  public getItemDescription(id: string){
    return this.os.getItem(id).subscribe({
      next: (data) => {
        return data.description;
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }
  */
}
