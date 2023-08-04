import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserLoginComponent } from './user-login/user-login.component';
import { UserHttpService } from './user-http.service';
import { TableListComponent } from './table-list/table-list.component';
import { TableHttpService } from './table-http.service';
import { TableEditorComponent } from './table-editor/table-editor.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderHttpService } from './order-http.service';
import { OrderedItemsComponent } from './ordered-items/ordered-items.component';
import { ItemHttpService } from './item-http.service';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemListEditorComponent } from './item-list-editor/item-list-editor.component';


@NgModule({

  // Modules
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],

  // Components
  declarations: [
    AppComponent,
    UserLoginComponent,
    TableListComponent,
    TableEditorComponent,
    OrderListComponent,
    OrderedItemsComponent,
    ItemListComponent,
    ItemListEditorComponent
  ],
  
  // Services
  providers: [
    { provide: UserHttpService, useClass: UserHttpService},
    { provide: TableHttpService, useClass: TableHttpService},
    { provide: OrderHttpService, useClass: OrderHttpService},
    { provide: ItemHttpService, useClass: ItemHttpService }
  ],

  exports: [ AppRoutingModule ],
  // Root component
  bootstrap: [AppComponent]
})
export class AppModule { }