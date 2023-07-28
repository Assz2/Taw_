import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.css']
})
export class TableEditorComponent {
  constructor() { }

  @Output() update: EventEmitter<string> = new EventEmitter<string>();

  sliderChecked = false;
  onSliderChange(event: Event){
    const slider = event.target as HTMLInputElement;
    this.sliderChecked = slider.checked;
    if(this.sliderChecked)
      this.update.emit("true");
    else
      this.update.emit("")
    }
}
