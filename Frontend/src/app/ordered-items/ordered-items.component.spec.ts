import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderedItemsComponent } from './ordered-items.component';

describe('OrderedItemsComponent', () => {
  let component: OrderedItemsComponent;
  let fixture: ComponentFixture<OrderedItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderedItemsComponent]
    });
    fixture = TestBed.createComponent(OrderedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
