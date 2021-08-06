import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import {PropertiesListComponent } from './properties-list/properties-list.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { ReservationComponent } from './reservation/reservation.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    AccountComponent,
    PropertiesListComponent,
    AddPropertyComponent,
    ReservationComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    MemberRoutingModule,
    SharedModule
  ]
})
export class MemberModule { }
