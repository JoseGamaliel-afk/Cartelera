import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CarteleraComponent } from './cartelera.component';
import { AuthComponent } from './auth.component';
import { PeliculaComponent } from './pelicula.component';

import { CineService } from './cine.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    CarteleraComponent,
    AuthComponent,
    PeliculaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [CineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
