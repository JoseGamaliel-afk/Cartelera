import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteleraComponent } from './cartelera.component';
import { AuthComponent } from './auth.component';
import { PeliculaComponent } from './pelicula.component';


const routes: Routes = [
  { path: '', component: CarteleraComponent },
  { path: 'login', component: AuthComponent },
  { path: 'admin', component: PeliculaComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },  
  { path: 'login/**', redirectTo: '', pathMatch: 'full' },  
  { path: 'admin/**', redirectTo: '', pathMatch: 'full' }  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
