import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteleraComponent } from './cartelera.component';
import { AuthComponent } from './auth.component';
import { PeliculaComponent } from './pelicula.component';

const routes: Routes = [
  // Redirige la raíz al componente 'cartelera' por defecto
  { path: '', redirectTo: '/cartelera', pathMatch: 'full' },
  
  // Ruta para mostrar el componente Cartelera
  { path: 'cartelera', component: CarteleraComponent },
  
  // Ruta para el login (puede ser pública para que los usuarios accedan)
  { path: 'login', component: AuthComponent },
  
  // Ruta para el panel de administración (requiere autenticación, por ejemplo)
  { path: 'admin', component: PeliculaComponent },
  
  // Ruta wildcard (por si hay rutas no definidas)
  { path: '**', redirectTo: '/cartelera', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
