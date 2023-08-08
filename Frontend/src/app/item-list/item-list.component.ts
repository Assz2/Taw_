import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttpService } from '../user-http.service';
import { ItemHttpService, Item } from '../item-http.service';
import { Order, OrderHttpService } from '../order-http.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements AfterViewInit {
  @Input() tabId: Number;

  public RetrievedItems: Item[] = [];
  private filter: string = "";

  public newOrder: String[] = [];
  public graphicalOrder = {};

  constructor(private router: Router, private it: ItemHttpService, private os: OrderHttpService, private us: UserHttpService) { }

  ngAfterViewInit(): void {
    this.getFilteredItems();
  }

  getFilteredItems(filterValue?: string): void{
    this.filter = filterValue;
    this.it.getItems(this.filter).subscribe(data => {
      this.RetrievedItems = data;
      
      this.RetrievedItems.sort((a, b) => {
        if(a.popularity > b.popularity) 
          return -1;
        else if(a.popularity < b.popularity) 
          return 1; 
        else 
          return 0;
      });
    });
  }

  addItemToOrder(item: Item): void{
    this.newOrder.push(item.name);
    this.graphicalOrder[item.name] = (this.graphicalOrder[item.name] || 0) + 1;
    console.log("NEW ORDER ARRAY: " + JSON.stringify(this.newOrder));
    console.log("GRAPHICAL ORDER: " + JSON.stringify(this.graphicalOrder));
  }

  removeItemFromOrder(item: Item): void{
    this.newOrder
    this.graphicalOrder[item.name] -= 1;
    if(this.graphicalOrder[item.name] == 0 || this.graphicalOrder[item.name] == undefined || this.graphicalOrder[item.name] == null)
      delete this.graphicalOrder[item.name];
    console.log("NEW ORDER ARRAY" + JSON.stringify(this.newOrder));
    console.log("GRAPHICAL ORDER: " + JSON.stringify(this.graphicalOrder));
  }

  sendOrder(): void{
    console.log("ACTUAL TABLE ID: " + this.tabId);
    let order = {
      "tableId": this.tabId,
      "associatedWaiter": this.us.getName(),
      "items": this.newOrder 
    };
    this.os.postOrder(order).subscribe(data => {
      console.log("Order sent: " + JSON.stringify(data));
      this.router.navigate(['/tables']);
    });
  }
}
