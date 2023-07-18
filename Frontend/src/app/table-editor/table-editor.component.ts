import { Component } from '@angular/core';

@Component({
  selector: 'app-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.css']
})
export class TableEditorComponent {

  sliderChecked = false;
  onSliderChange(event: Event){
    const slider = event.target as HTMLInputElement;
    this.sliderChecked = slider.checked;
  }
}
