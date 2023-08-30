import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemHttpService, Item } from '../item-http.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  public errmessage: string = "";
  public item: Item = {
    name: '',
    type: '',
    price: 0,
    popularity: 0,
    description: '',
  };

  constructor(private router: Router, private it: ItemHttpService) { }

  ngOnInit(): void {
  }

  goToTables(){
    this.router.navigate(['/tables']);
  }

  isValidPrice(){
    return this.item.price > 0;
  }

  addItem(){
    this.it.postItem(this.item).subscribe({
      next: (data) => {
        console.log("Posted item: " + JSON.stringify(data));
        this.errmessage = "";
        this.goToTables();
      },
      error: (err) => {
        console.log("Error: " + JSON.stringify(err));
        this.errmessage = err.error.errormessage;
      }
    }); 
  }
}
