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
      next: (respuesta: any) => {
        this.usuario = respuesta;
        this.rol = respuesta.rol;
        this.errorLogin = '';
        localStorage.setItem('auth_token', respuesta.token); // Guardar el token Base64
        localStorage.setItem('user_role', respuesta.rol);
        localStorage.setItem('user_name', respuesta.nombre); // Guardar nombre para mostrarlo

        // Mensaje de bienvenida (opcional)
        console.log(`Bienvenido ${respuesta.nombre} (Rol: ${respuesta.rol})`);

        // Redirigir según el rol
        if (respuesta.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/cartelera']);
        }
      },
      error: () => {
        this.errorLogin = 'Usuario o contraseña incorrectos';
      }
    });
  }

  cerrarSesion(): void {
    this.usuario = null;
    this.rol = '';
    this.credenciales = { strNombre: '', strPwd: '' };
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    this.router.navigate(['/cartelera']);
  }

  navegarPanelAdmin(): void {
    if (this.rol === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.errorLogin = 'Acceso denegado: se requiere rol de administrador';
    }
  }
}