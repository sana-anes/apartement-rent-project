import { NavbarComponent } from './navbar/navbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';
import {PropertiesListComponent } from './properties-list/properties-list.component';
import { ReservationComponent } from './reservation/reservation.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { AccountComponent } from './account/account.component';
import { PersonelInfoComponent } from './personel-info/personel-info.component';
import { SecurityComponent } from './security/security.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ContentComponent } from './content/content.component';
import { FeedbackComponent } from './feedback/feedback.component';


@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    PropertiesListComponent,
    ReservationComponent,
    NavbarComponent,
    PropertyDetailsComponent,
    AccountComponent,
    PersonelInfoComponent,
    SecurityComponent,
    UsersListComponent,
    ContentComponent,
    FeedbackComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    CarouselModule,
     WavesModule,
     MatDatepickerModule,
     MatNativeDateModule
  ]
})
export class AdminModule { }
