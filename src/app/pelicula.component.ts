import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CineService } from './cine.service';

@Component({
  selector: 'app-pelicula',
  templateUrl: './pelicula.component.html',
  styleUrls: ['./pelicula.component.css']
})
export class PeliculaComponent implements OnInit {
  cartelera: any[] = [];
  mostrarFormularioAgregar = false;
  mostrarFormularioEditar = false;
  nuevaPelicula: any = this.inicializarPelicula();
  peliculaEditando: any = null;

  constructor(
    private cineService: CineService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validarSesion();
    this.obtenerCartelera();
  }

  // Validación de sesión en el inicio
  validarSesion(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const rol = localStorage.getItem('user_role');  // Obtenemos el rol del usuario desde localStorage

      // Si no hay token o el rol no es admin, redirigimos a la cartelera
      if (!token || rol !== 'admin') {
        throw new Error('No autenticado o no tiene permisos de administrador');
      }
    } catch (err) {
      console.error('Acceso denegado:', err);
      this.limpiarSesion();
      // Redirigimos al usuario a la cartelera si no está logeado o no es admin
      this.router.navigate(['/cartelera']);
    }
  }

  // Limpiar la sesión
  limpiarSesion(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');  // Limpiamos también el rol del usuario
  }

  // Obtener cartelera
  obtenerCartelera(): void {
    this.cineService.getCartelera().subscribe({
      next: (data) => this.cartelera = data,
      error: (error) => this.manejarError(error, 'obtener la cartelera')
    });
  }

  // Agregar película
  agregarPelicula(): void {
    if (!this.validarPelicula(this.nuevaPelicula)) {
      alert('Por favor, complete todos los campos correctamente');
      return;
    }

    this.cineService.agregarPelicula(this.nuevaPelicula).subscribe({
      next: () => {
        alert('Película agregada correctamente');
        this.obtenerCartelera();
        this.nuevaPelicula = this.inicializarPelicula();
        this.mostrarFormularioAgregar = false;
      },
      error: (error) => this.manejarError(error, 'agregar la película')
    });
  }

  // Editar película
  editarPelicula(): void {
    if (!this.peliculaEditando?.id) return;

    this.cineService.editarPelicula(this.peliculaEditando.id, this.peliculaEditando).subscribe({
      next: () => {
        alert('Película editada correctamente');
        this.obtenerCartelera();
        this.mostrarFormularioEditar = false;
      },
      error: (error) => this.manejarError(error, 'editar la película')
    });
  }

  // Eliminar película
  eliminarPelicula(pelicula: any): void {
    if (!pelicula?.id || !confirm('¿Estás seguro de eliminar esta película?')) return;

    this.cineService.eliminarPelicula(pelicula.id).subscribe({
      next: () => {
        alert('Película eliminada correctamente');
        this.obtenerCartelera();
      },
      error: (error) => this.manejarError(error, 'eliminar la película')
    });
  }

  // Mostrar formulario para agregar película
  mostrarFormularioAgregarPelicula(): void {
    this.mostrarFormularioAgregar = true;
    this.mostrarFormularioEditar = false;
  }

  // Inicializar película
  private inicializarPelicula() {
    return {
      id: null,
      strNombre: '',
      strGenero: '',
      strSinapsis: '',
      strHorario: '',
      idSala: null,
      strImagen: ''
    };
  }

  // Validación de película
  private validarPelicula(pelicula: any): boolean {
    const validString = (str: string) => !/<.*?>/.test(str.trim());
    
    const trimStart = (str: string) => str.replace(/^\s+/g, '');

    pelicula.strNombre = trimStart(pelicula.strNombre.trim());
    pelicula.strGenero = trimStart(pelicula.strGenero.trim());
    pelicula.strSinapsis = trimStart(pelicula.strSinapsis.trim());
    pelicula.strHorario = trimStart(pelicula.strHorario.trim());
    pelicula.strImagen = trimStart(pelicula.strImagen.trim());

    if (
      !pelicula.strNombre ||
      !pelicula.strGenero ||
      !pelicula.strSinapsis ||
      !pelicula.strHorario ||
      !pelicula.strImagen ||
      !validString(pelicula.strNombre) ||
      !validString(pelicula.strGenero) ||
      !validString(pelicula.strSinapsis)
    ) {
      alert('Por favor, complete todos los campos correctamente, sin espacios al principio.');
      return false;
    }

    if (pelicula.idSala < 1 || pelicula.idSala > 5) {
      alert('El ID de la sala debe ser un valor entre 1 y 5.');
      return false;
    }

    const limites = {
      strNombre: 100,
      strGenero: 50,
      strSinapsis: 500,
      strHorario: 50,
      strImagen: 255
    };

    if (
      pelicula.strNombre.length > limites.strNombre ||
      pelicula.strGenero.length > limites.strGenero ||
      pelicula.strSinapsis.length > limites.strSinapsis ||
      pelicula.strHorario.length > limites.strHorario ||
      pelicula.strImagen.length > limites.strImagen
    ) {
      alert('Uno o más campos han alcanzado el límite de caracteres permitido.');
      return false;
    }

    return true;
  }

  // Manejo de errores
  private manejarError(error: any, accion: string): void {
    console.error(`Error al ${accion}:`, error);

    if (error.status === 401 || error.status === 403) {
      alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
      this.limpiarSesion();
      this.router.navigate(['/login']);
    } else if (error.status === 500) {
      alert(`Hubo un problema interno al ${accion}. Por favor, inténtalo más tarde.`);
    } else {
      alert(`Ocurrió un error al ${accion}.`);
    }
  }
}
