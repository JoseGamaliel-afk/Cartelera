import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteleraComponent } from './cartelera.component';
import { AuthComponent } from './auth.component';
import { PeliculaComponent } from './pelicula.component';

const routes: Routes = [
  // Cargar directamente Cartelera en la raíz
  { path: '', component: CarteleraComponent },

  // Ruta para login
  { path: 'login', component: AuthComponent },

  // Ruta para administración
  { path: 'admin', component: PeliculaComponent },

  // Ruta wildcard para manejar URLs no definidas
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
