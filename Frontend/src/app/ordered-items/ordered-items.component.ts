import { AfterViewInit, Component, ElementRef, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { Order, OrderHttpService } from '../order-http.service';
import { ItemHttpService, Item } from '../item-http.service';
import { ItemListComponent } from '../item-list/item-list.component';


@Component({
  selector: 'app-ordered-items',
  templateUrl: './ordered-items.component.html',
  styleUrls: ['./ordered-items.component.css']
})
export class OrderedItemsComponent implements AfterViewInit{
  @Input() parameterFromParent: Number;

  @ViewChild(ItemListComponent) itemList: ItemListComponent;

  public RetrievedItems: Item[] = [];
  public addItem: Boolean = false;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private os: OrderHttpService, private it: ItemHttpService) { }

  ngAfterViewInit() {
    console.log("parameterFromParent: " + this.parameterFromParent);
    if(this.parameterFromParent)
      this.getOrderedItems();
  }
  
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

  getOrders(filter: Number){
    this.parameterFromParent = -1;
    this.router.navigate(['/orders']);
  }

  getItems(){
    this.addItem = true;
    //this.router.navigate(['/menu']);
  }
}
