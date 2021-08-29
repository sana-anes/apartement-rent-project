import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { RoutingModule } from './routing.module';
import { SharedModule } from './../shared/shared.module';
import { SearchComponent } from './search/search.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md'
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';


@NgModule({
  declarations: [
    HomeComponent,
    MainComponent,
    AboutComponent,
    ContactUsComponent,
    FooterComponent,
    HeaderComponent,
    HelpComponent,
    PropertyDetailsComponent,

  ],

  imports: [
    CommonModule,
    RoutingModule,
    SharedModule,
    CarouselModule, WavesModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ClientModule {  }

