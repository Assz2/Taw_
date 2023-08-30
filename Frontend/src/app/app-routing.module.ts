import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from './user-login/user-login.component';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { TableListComponent } from './table-list/table-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { OrderListComponent } from './order-list/order-list.component';
import { ItemListComponent } from './item-list/item-list.component';
import { SignupComponent } from './signup/signup.component';
import { UserListComponent } from './user-list/user-list.component';
import { TableManagementComponent } from './table-management/table-management.component';

const routes: Routes = [
  { path:'', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',  component: UserLoginComponent },
  { path: 'tables',  component: TableListComponent },
  { path: 'orders',  component: OrderListComponent },
  { path: 'menu', component: ItemListComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'users', component: UserListComponent },
  { path: 'addtb', component: TableManagementComponent }
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
