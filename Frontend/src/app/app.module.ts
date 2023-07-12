import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './user-login/user-login.component';

import { UserHttpService } from './user-http.service';
import { TableListComponent } from './table-list/table-list.component';


@NgModule({
  // Components
  declarations: [
    AppComponent,
    UserLoginComponent,
    TableListComponent
  ],
  // Modules
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  // Services
  providers: [
    { provide: UserHttpService, useClass: UserHttpService}
  ],

  exports: [ AppRoutingModule ],
  // Root component
  bootstrap: [AppComponent]
})
export class AppModule { }
