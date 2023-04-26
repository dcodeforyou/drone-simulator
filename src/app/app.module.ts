import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './containers/landing/landing.component';
import { MapComponent } from './components/map/map.component';
import { InputsComponent } from './components/inputs/inputs.component';
import { InputService } from './services/input.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    MapComponent,
    InputsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
  ],
  providers: [InputService],
  bootstrap: [AppComponent]
})
export class AppModule { }
