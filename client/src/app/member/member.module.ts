import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import {PropertiesListComponent } from './properties-list/properties-list.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { ReservationComponent } from './reservation/reservation.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { AccountComponent } from './account/account.component';
import { PersonelInfoComponent } from './personel-info/personel-info.component';
import { SecurityComponent } from './security/security.component';
import { PropertyReservationsComponent } from './property-reservations/property-reservations.component';


@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    EditPropertyComponent,
    PropertiesListComponent,
    AddPropertyComponent,
    ReservationComponent,
    NavbarComponent,
    PropertyDetailsComponent,
    AccountComponent,
    PersonelInfoComponent,
    SecurityComponent,
    PropertyReservationsComponent
  ],
  imports: [
    CommonModule,
    MemberRoutingModule,
    SharedModule,
    CarouselModule,
     WavesModule,
     MatDatepickerModule,
     MatNativeDateModule
  ]
})
export class MemberModule { }
