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

  // Validación de sesión
  validarSesion(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const rol = localStorage.getItem('user_role');

      if (!token || rol !== 'admin') {
        throw new Error('No autenticado o no tiene permisos de administrador');
      }
    } catch (err) {
      console.error('Acceso denegado:', err);
      this.limpiarSesion();
      this.router.navigate(['']);
    }
  }

  // Limpiar sesión
  limpiarSesion(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
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
    if (!this.peliculaEditando?.id || !this.validarPelicula(this.peliculaEditando)) {
      return;
    }

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

  // Mostrar formulario de agregar
  mostrarFormularioAgregarPelicula(): void {
    this.mostrarFormularioAgregar = true;
    this.mostrarFormularioEditar = false;
  }

  // Preparar edición
  prepararEdicion(pelicula: any): void {
    this.peliculaEditando = { ...pelicula };
    this.mostrarFormularioEditar = true;
    this.mostrarFormularioAgregar = false;
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.mostrarFormularioEditar = false;
    this.mostrarFormularioAgregar = false;
  }

  // Validación para el template
  formularioValido(pelicula: any): boolean {
    if (!pelicula) return false;
    
    // Validación básica de campos requeridos
    const camposRequeridos = [
      'strNombre',
      'strGenero',
      'strSinapsis',
      'strHorario',
      'strImagen',
      'idSala'
    ];
    
    for (const campo of camposRequeridos) {
      if (!pelicula[campo]) return false;
    }
    
    // Validación de sala
    if (pelicula.idSala < 1 || pelicula.idSala > 5) return false;
    
    // Validación de URL de trailer si existe
    if (pelicula.strTrailerURL && !this.validarUrl(pelicula.strTrailerURL)) return false;
    
    return true;
  }

  // Validación de URL genérica
  validarUrl(url: string): boolean {
    if (!url) return true;
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      // Patrón alternativo para navegadores antiguos
      const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return pattern.test(url);
    }
  }

  // Inicializar objeto película
  private inicializarPelicula() {
    return {
      strNombre: '',
      strGenero: '',
      strSinapsis: '',
      strHorario: '',
      idSala: 1,
      strImagen: '',
      strTrailerURL: ''
    };
  }

  // Validación completa de película
  private validarPelicula(pelicula: any): boolean {
    const validString = (str: string) => !/<.*?>/.test(str.trim());
    const trimStart = (str: string) => str.replace(/^\s+/g, '');

    // Limpiar y validar campos de texto
    pelicula.strNombre = trimStart(pelicula.strNombre?.trim() || '');
    pelicula.strGenero = trimStart(pelicula.strGenero?.trim() || '');
    pelicula.strSinapsis = trimStart(pelicula.strSinapsis?.trim() || '');
    pelicula.strHorario = trimStart(pelicula.strHorario?.trim() || '');
    pelicula.strImagen = trimStart(pelicula.strImagen?.trim() || '');
    pelicula.strTrailerURL = trimStart(pelicula.strTrailerURL?.trim() || '');

    // Validar campos requeridos
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
      alert('Por favor, complete todos los campos obligatorios correctamente, sin espacios al principio.');
      return false;
    }

    // Validar sala
    if (isNaN(pelicula.idSala)) {
      alert('El ID de sala debe ser un número');
      return false;
    }

    if (pelicula.idSala < 1 || pelicula.idSala > 5) {
      alert('El ID de la sala debe ser un valor entre 1 y 5.');
      return false;
    }

    // Validar URL de trailer (ahora acepta cualquier URL válida)
    if (pelicula.strTrailerURL && !this.validarUrl(pelicula.strTrailerURL)) {
      alert('La URL proporcionada no es válida. Por favor ingrese una URL válida.');
      return false;
    }

    // Validar límites de caracteres
    const limites = {
      strNombre: 100,
      strGenero: 50,
      strSinapsis: 500,
      strHorario: 50,
      strImagen: 255,
      strTrailerURL: 255
    };

    for (const [campo, limite] of Object.entries(limites)) {
      if (pelicula[campo] && pelicula[campo].length > limite) {
        alert(`El campo ${campo} ha excedido el límite de ${limite} caracteres.`);
        return false;
      }
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