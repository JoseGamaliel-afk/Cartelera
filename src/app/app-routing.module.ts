import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteleraComponent } from './cartelera.component';
import { AuthComponent } from './auth.component';
import { PeliculaComponent } from './pelicula.component';

const routes: Routes = [
  { path: '', component: CarteleraComponent },
  { path: 'login', component: AuthComponent },
  { path: 'admin', component: PeliculaComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }  // Eliminé las rutas duplicadas de login/** y admin/**
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],  // ¡Agregué useHash aquí!
  exports: [RouterModule]
})
export class AppRoutingModule { }