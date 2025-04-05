import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CineApp';

  // Obtiene el rol del usuario desde localStorage
  get rol(): string {
    return localStorage.getItem('user_role') || '';
  }

  // Cerrar sesión
  cerrarSesion(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');  // Limpiamos el rol al cerrar sesión

    // Verificar si el token fue eliminado correctamente
    if (!localStorage.getItem('auth_token')) {
      // Redirigir a la cartelera después de cerrar sesión
      this.router.navigate(['/cartelera']);  // Asegúrate de que la ruta esté correctamente escrita
    } else {
      // Si por alguna razón el token no fue eliminado, redirigir a la página de error
      this.router.navigate(['/error']);  // O a cualquier página de error que prefieras
    }
  }

  constructor(private router: Router) {}
}
