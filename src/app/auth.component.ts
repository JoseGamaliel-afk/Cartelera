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
    if (!this.credenciales.strNombre || !this.credenciales.strPwd) {
      this.errorLogin = 'Debes ingresar usuario y contraseña';
      return;
    }

    this.cineService.login(this.credenciales.strNombre, this.credenciales.strPwd).subscribe({
      next: (respuesta) => {
        this.usuario = respuesta;
        this.rol = respuesta.rol;
        this.errorLogin = '';
        localStorage.setItem('auth_token', respuesta.token);
        localStorage.setItem('user_role', respuesta.rol);  // Guardamos el rol del usuario

        alert(`Bienvenido ${respuesta.strNombre} (Rol: ${respuesta.rol})`);

        // Redirige según el rol del usuario
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
    localStorage.removeItem('user_role');  // Limpiamos el rol al cerrar sesión
    this.router.navigate(['/cartelera']);
  }

  navegarPanelAdmin(): void {
    this.router.navigate(['/admin']);  // Método que navega al panel admin
  }
}
