import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CineService } from './cine.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  credenciales = { strNombre: '', strPwd: '' };
  usuario: any = null;
  rol: string = '';
  errorLogin: string = '';

  constructor(private cineService: CineService, private router: Router) {}

  iniciarSesion(): void {
    // Validación de campos vacíos
    if (!this.credenciales.strNombre || !this.credenciales.strPwd) {
      this.errorLogin = 'Debes ingresar usuario y contraseña';
      return;
    }

    // Realizar el login usando el servicio
    this.cineService.login(this.credenciales.strNombre, this.credenciales.strPwd).subscribe({
      next: (respuesta) => {
        this.usuario = respuesta;
        this.rol = respuesta.rol;
        this.errorLogin = ''; // Limpiar errores previos
        localStorage.setItem('auth_token', respuesta.token); // Guardamos el token de sesión
        localStorage.setItem('user_role', respuesta.rol); // Guardamos el rol del usuario

        // Mensaje de bienvenida
        alert(`Bienvenido ${respuesta.strNombre} (Rol: ${respuesta.rol})`);

        // Redirigir según el rol del usuario
        if (respuesta.rol === 'admin') {
          this.router.navigate(['/admin']); // Navegar a la ruta del panel de administración si es admin
        } else {
          this.router.navigate(['/cartelera']); // Si no es admin, llevar a la cartelera
        }
      },
      error: () => {
        this.errorLogin = 'Usuario o contraseña incorrectos'; // Error si las credenciales son incorrectas
      }
    });
  }

  cerrarSesion(): void {
    this.usuario = null;
    this.rol = '';
    this.credenciales = { strNombre: '', strPwd: '' }; // Limpiar las credenciales
    localStorage.removeItem('auth_token'); // Limpiar el token de sesión
    localStorage.removeItem('user_role'); // Limpiar el rol del usuario
    this.router.navigate(['/cartelera']); // Redirigir a la cartelera después de cerrar sesión
  }

  navegarPanelAdmin(): void {
    // Verificar si el usuario es admin antes de navegar al panel
    if (this.rol === 'admin') {
      this.router.navigate(['/admin']); // Navegar al panel de administración
    } else {
      this.errorLogin = 'No tienes acceso al panel de administración'; // Mensaje de error si no es admin
    }
  }
}
