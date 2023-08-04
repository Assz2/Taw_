import { AfterViewInit, Component, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { filter, forkJoin } from 'rxjs';
import { Order, OrderHttpService } from '../order-http.service';
import { ItemHttpService, Item } from '../item-http.service';



@Component({
  selector: 'app-ordered-items',
  templateUrl: './ordered-items.component.html',
  styleUrls: ['./ordered-items.component.css']
})
export class OrderedItemsComponent implements AfterViewInit{
  @Input() parameterFromParent: Number;

  public RetrievedItems: Item[] = [];

  constructor(private router: Router, private cdr: ChangeDetectorRef, private os: OrderHttpService, private it: ItemHttpService) { }

  ngAfterViewInit() {
    console.log("parameterFromParent: " + this.parameterFromParent);
    if(this.parameterFromParent)
      this.getOrderedItems();
  }

  /*
  getOrderedItems() {
    this.os.getOrders(this.parameterFromParent).subscribe(data => {
      const itemObservables = data.flatMap(element =>
        element.items.map(itemId => this.it.getItemByName(itemId))
      );
      
      forkJoin(itemObservables).subscribe(retrItems => {
        this.RetrievedItems = retrItems as Item[];
        this.cdr.detectChanges(); // Trigger change detection
        console.log("Retrieved Items: " + JSON.stringify(this.RetrievedItems));
        
        // You can add a separate log here to see the array contents after all items are fetched.
        console.log("Final Retrieved Items: ", JSON.stringify(this.RetrievedItems));
      });
    });
  }
  */

  
  getOrderedItems() {
    this.os.getOrders(this.parameterFromParent).subscribe(data => {
      data.forEach(element => {
        element.items.forEach(itemId => {
          this.it.getItemByName(itemId).subscribe(retrItem => {
            console.log("Retrieved Item: " + JSON.stringify(retrItem));
            this.RetrievedItems.push(retrItem as Item);
            this.cdr.detectChanges();
          });
        });
      });
      console.log("Retrieved Item: " + JSON.stringify(this.RetrievedItems));
    });
  }
  

  /*
  getOrderedItems(){
    this.os.getOrders(this.parameterFromParent).subscribe(data => {
      data.forEach(element => {
        element.items.forEach(itemId => {
          this.it.getItemByName(itemId).subscribe(retrItem => {
            this.RetrievedItems.push(retrItem as Item);
          });
        });
      });
      this.cdr.detectChanges();
      console.log("Retrieved Item: " + JSON.stringify(this.RetrievedItems));
    });
  }
  */
  /*
  getOrderedItems(id: Number){
    this.os.getOrders(id).subscribe(data => {
      data.forEach(element => {
        element.items.forEach(itemId => {
          this.it.getItemByName(itemId).subscribe(retrItem => {
            this.RetrievedItems.push(retrItem as Item);
          });
        });
      });
      this.cdr.detectChanges();
    });

    console.log("Retrieved Item: " + JSON.stringify(this.RetrievedItems));
  }
  */
}
