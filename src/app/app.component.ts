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
    this.router.navigate(['/cartelera']);
  }

  constructor(private router: Router) {}
}
