import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';


import { AppComponent } from './app.component';
import { ClientModule } from './client/client.module';

import { authInterceptorProviders } from './shared/interceptors/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent, 
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClientModule,
    HttpClientModule, 
    SharedModule,
    AuthModule
  ],
  providers: [
    authInterceptorProviders 
  ],
  //entryComponents: [DialogboxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }