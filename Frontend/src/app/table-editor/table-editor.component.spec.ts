import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableEditorComponent } from './table-editor.component';

describe('TableEditorComponent', () => {
  let component: TableEditorComponent;
  let fixture: ComponentFixture<TableEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableEditorComponent]
    });
    fixture = TestBed.createComponent(TableEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
