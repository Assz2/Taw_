import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';

import { UserHttpService } from './user-http.service';
import { TableListComponent } from './table-list/table-list.component';
import { TableHttpService } from './table-http.service';
import { TableEditorComponent } from './table-editor/table-editor.component';


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
    TableEditorComponent
  ],
  
  // Services
  providers: [
    { provide: UserHttpService, useClass: UserHttpService},
    { provide: TableHttpService, useClass: TableHttpService}
  ],

  exports: [ AppRoutingModule ],
  // Root component
  bootstrap: [AppComponent]
})
export class AppModule { }
