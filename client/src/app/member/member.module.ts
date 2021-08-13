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
import { MatCarouselModule } from '@ngmodule/material-carousel';
import {IvyCarouselModule} from 'angular-responsive-carousel';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    EditPropertyComponent,
    PropertiesListComponent,
    AddPropertyComponent,
    ReservationComponent,
    NavbarComponent,
    PropertyDetailsComponent
  ],
  imports: [
    CommonModule,
    MemberRoutingModule,
    SharedModule,
    MatCarouselModule.forRoot(),
    IvyCarouselModule

  ]
})
export class MemberModule { }
