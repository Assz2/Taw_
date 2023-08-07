import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemHttpService, Item } from '../item-http.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements AfterViewInit {

  public RetrievedItems: Item[] = [];
  private filter: string = "";

  constructor(private router: Router, private it: ItemHttpService) { }

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
}
