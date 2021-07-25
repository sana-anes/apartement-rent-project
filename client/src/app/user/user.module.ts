import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { UserPropertyComponent } from './user-property/user-property.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { ReservationComponent } from './reservation/reservation.component';
import { SharedModule } from './../shared/shared.module';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    AccountComponent,
    UserPropertyComponent,
    AddPropertyComponent,
    ReservationComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
