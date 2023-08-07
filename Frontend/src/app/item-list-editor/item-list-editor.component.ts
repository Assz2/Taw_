import { Component, EventEmitter, Output } from '@angular/core';
//import { RouterExtensions } from '@nativescript/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-list-editor',
  templateUrl: './item-list-editor.component.html',
  styleUrls: ['./item-list-editor.component.css']
})
export class ItemListEditorComponent {
  constructor( private rt: Router) { }

  @Output() update: EventEmitter<string> = new EventEmitter<string>();

  filter: string = "";

  filterFood(event: Event): void{
    this.filter = "food";
    this.update.emit(this.filter);
  }

  filterDrink(event: Event): void{
    this.filter = "drink";
    this.update.emit(this.filter);
  }

  filterAlcool(event: Event): void{
    this.filter = "alcool";
    this.update.emit(this.filter);
  }

  filterAll(event: Event): void{
    this.filter = "";
    this.update.emit(this.filter);
  }

  exit(){
    window.location.reload();
  }
}
