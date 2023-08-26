import { AfterViewInit, Component, ElementRef, Input, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { Order, OrderHttpService } from '../order-http.service';
import { ItemHttpService, Item } from '../item-http.service';
import { ItemListComponent } from '../item-list/item-list.component';
import { UserHttpService } from '../user-http.service';
import { SocketIoService } from '../socket-io.service';


@Component({
  selector: 'app-ordered-items',
  templateUrl: './ordered-items.component.html',
  styleUrls: ['./ordered-items.component.css']
})
export class OrderedItemsComponent implements AfterViewInit{
  @Input() parameterFromParent: Number;

  @Output() orderStatistic = new EventEmitter<Number>();

  @ViewChild(ItemListComponent) itemList: ItemListComponent;

  public RetrievedItems: Item[] = [];
  public addItem: Boolean = false;
  public retrievedOrder: Order;
  public userRole: string;
  public actualStatus: string;
  public total: number = 0;
  public flag: Boolean;

  constructor(private router: Router, private cdr: ChangeDetectorRef, private os: OrderHttpService,
              private it: ItemHttpService, private us: UserHttpService, private sio: SocketIoService) { }

  ngAfterViewInit() {
    console.log("parameterFromParent: " + this.parameterFromParent);
    if(this.parameterFromParent)
      this.getOrderedItems();

    this.userRole = this.us.getRole();
    console.log("User role: " + this.userRole);

    this.os.getOrders(this.parameterFromParent).subscribe(data => {
      this.actualStatus = data.at(-1).status;
    });

    
    this.sio.connectToChange().subscribe( (data) => {
      console.log("Received change: " + JSON.stringify(data));
      this.getOrders(-1);
    });

    this.setFlag();
  }
  
  getOrderedItems() {
    this.os.getOrders(this.parameterFromParent).subscribe(data => {
      data.forEach(element => {
        this.retrievedOrder = element;
        element.items.forEach(itemId => {
          this.it.getItemByName(itemId).subscribe(retrItem => {
            console.log("Retrieved Item: " + JSON.stringify(retrItem) + " with popularity: " + retrItem.popularity);
            this.RetrievedItems.push(retrItem as Item);
            this.total += retrItem.price;
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
    console.log("Actual TableId: " + (this.parameterFromParent));
    this.orderStatistic.emit(this.parameterFromParent);
    this.addItem = true;
  }

  updateOrderStatus(){
    this.os.updateOrderStatus(this.parameterFromParent);
    this.actualStatus = this.os.currentStatus;
    console.log("Actual status: " + this.actualStatus);
    //this.cdr.detectChanges();
  }

  deleteOrder(){
    console.log("Delete order: " + this.parameterFromParent);
    this.os.getOrders(this.parameterFromParent).subscribe(data => {
      data.forEach(element => {
        //if(element.status === "READY")
          this.os.deleteOrder(element);
      });
    });
    this.parameterFromParent = -1;
    this.getOrders(-1);
    this.router.navigate(['/orders']);
  }

  setFlag(){
    this.os.getOrders(this.parameterFromParent).subscribe(data => {
      data.forEach(element => {
        if(element.status != "READY"){
          setTimeout(() => {
            this.flag = false;
            return this.flag;
          });
        }
        this.flag = true;
        return this.flag;
      });
    });
  }
}
