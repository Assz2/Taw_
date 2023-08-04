import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListEditorComponent } from './item-list-editor.component';

describe('ItemListEditorComponent', () => {
  let component: ItemListEditorComponent;
  let fixture: ComponentFixture<ItemListEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemListEditorComponent]
    });
    fixture = TestBed.createComponent(ItemListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
