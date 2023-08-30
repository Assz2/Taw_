import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemHttpService, Item } from '../item-http.service';
import { UserHttpService } from '../user-http.service';

@Component({
  selector: 'app-item-management',
  templateUrl: './item-management.component.html',
  styleUrls: ['./item-management.component.css']
})
export class ItemManagementComponent implements OnInit{
  public itemList: Item[];

  constructor(private router: Router, private it: ItemHttpService, private us: UserHttpService) { }

  ngOnInit() {
    this.getItems();
  }

  public getItems() {
    this.it.getItems("").subscribe({
      next: (data) => {
        if (Array.isArray(data))
          this.itemList = data;
        else
          this.itemList = [data];
        //console.log("Received users: " + JSON.stringify(this.userList));
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.us.logout();
      }
    });
  }

  goToTables(){
    this.router.navigate(['/tables']);
  }

  routeAddItem(){
    this.router.navigate(['/item-editor']);
  }

  deleteItem(id: string){
    this.it.deleteItem(id).subscribe({
      next: (data) => {
        console.log("Deleted item: " + JSON.stringify(data));
        this.getItems();
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
      }
    });
    this.goToTables();
  }

}
