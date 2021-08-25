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



@NgModule({
  declarations: [
    HomeComponent,
    MainComponent,
    AboutComponent,
    ContactUsComponent,
    FooterComponent,
    HeaderComponent,
    HelpComponent
  ],

  imports: [
    CommonModule,
    RoutingModule,
    SharedModule
  ]
})
export class ClientModule {  }

