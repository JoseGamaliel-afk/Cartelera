import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { CineService } from './cine.service';
import { DomSanitizer } from '@angular/platform-browser';

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
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    
    this.obtenerCartelera();
  }

  

  

  obtenerCartelera(): void {
    this.cineService.getCartelera().subscribe({
      next: (data) => this.cartelera = data,
      error: (error) => this.manejarError(error, 'obtener la cartelera')
    });
  }

  agregarPelicula(): void {
    const peliculaSanitizada = this.sanitizarDatosPelicula(this.nuevaPelicula);
    
    if (!this.validarPelicula(peliculaSanitizada)) {
      return;
    }

    this.cineService.agregarPelicula(peliculaSanitizada).subscribe({
      next: () => {
        alert('Película agregada correctamente');
        this.obtenerCartelera();
        this.nuevaPelicula = this.inicializarPelicula();
        this.mostrarFormularioAgregar = false;
      },
      error: (error) => this.manejarError(error, 'agregar la película')
    });
  }

  editarPelicula(): void {
    const peliculaSanitizada = this.sanitizarDatosPelicula(this.peliculaEditando);
    
    if (!peliculaSanitizada?.id || !this.validarPelicula(peliculaSanitizada)) {
      return;
    }

    this.cineService.editarPelicula(peliculaSanitizada.id, peliculaSanitizada).subscribe({
      next: () => {
        alert('Película editada correctamente');
        this.obtenerCartelera();
        this.mostrarFormularioEditar = false;
      },
      error: (error) => this.manejarError(error, 'editar la película')
    });
  }

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

  mostrarFormularioAgregarPelicula(): void {
    this.mostrarFormularioAgregar = true;
    this.mostrarFormularioEditar = false;
  }

  prepararEdicion(pelicula: any): void {
    this.peliculaEditando = { ...pelicula };
    this.mostrarFormularioEditar = true;
    this.mostrarFormularioAgregar = false;
  }

  cancelarEdicion(): void {
    this.mostrarFormularioEditar = false;
    this.mostrarFormularioAgregar = false;
  }

  formularioValido(pelicula: any): boolean {
    if (!pelicula) return false;
    
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
    
    if (pelicula.idSala < 1 || pelicula.idSala > 5) return false;
    
    if (pelicula.strTrailerURL && !this.validarUrl(pelicula.strTrailerURL)) return false;
    
    return true;
  }

  validarUrl(url: string): boolean {
    if (!url) return true;
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return pattern.test(url);
    }
  }

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

  private sanitizarDatosPelicula(pelicula: any): any {
    return {
      ...pelicula,
      id: pelicula.id ? Number(pelicula.id) : null,
      strNombre: this.sanitizarTexto(pelicula.strNombre),
      strGenero: this.sanitizarTexto(pelicula.strGenero),
      strSinapsis: this.sanitizarTexto(pelicula.strSinapsis),
      strHorario: this.sanitizarTexto(pelicula.strHorario),
      strImagen: this.sanitizarUrl(pelicula.strImagen),
      strTrailerURL: pelicula.strTrailerURL ? this.sanitizarUrl(pelicula.strTrailerURL) : null,
      idSala: Number(pelicula.idSala)
    };
  }

  private sanitizarTexto(texto: string): string {
    if (!texto) return '';
    return texto.replace(/<[^>]*>/g, '').replace(/[<>"'`]/g, '').trim();
  }

  private sanitizarUrl(url: string): string {
    if (!url) return '';
    const safeUrl = this.sanitizer.sanitize(SecurityContext.URL, url) || '';
    return safeUrl.replace(/javascript:/gi, '').replace(/[<>"'`]/g, '');
  }

  private validarPelicula(pelicula: any): boolean {
    const trimStart = (str: string) => str.replace(/^\s+/g, '');

    if (
      !pelicula.strNombre ||
      !pelicula.strGenero ||
      !pelicula.strSinapsis ||
      !pelicula.strHorario ||
      !pelicula.strImagen
    ) {
      alert('Por favor, complete todos los campos correctamente.');
      return false;
    }

    const tieneCodigoPeligroso = [
      pelicula.strNombre,
      pelicula.strGenero,
      pelicula.strSinapsis,
      pelicula.strHorario,
      pelicula.strImagen,
      pelicula.strTrailerURL
    ].some(campo => campo && /[<>"'`]|javascript:/gi.test(campo));

    if (tieneCodigoPeligroso) {
      alert('Los campos contienen caracteres no permitidos.');
      return false;
    }

    if (isNaN(pelicula.idSala)) {
      alert('El ID de sala debe ser un número');
      return false;
    }

    if (pelicula.idSala < 1 || pelicula.idSala > 5) {
      alert('El ID de la sala debe ser un valor entre 1 y 5.');
      return false;
    }

    if (pelicula.strTrailerURL && !this.validarUrl(pelicula.strTrailerURL)) {
      alert('La URL proporcionada no es válida.');
      return false;
    }

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

  private manejarError(error: any, accion: string): void {
    console.error(`Error al ${accion}:`, error);

    if (error.status === 401 || error.status === 403) {
      alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
      
      this.router.navigate(['/login']);
    } else if (error.status === 500) {
      alert(`Hubo un problema interno al ${accion}. Por favor, inténtalo más tarde.`);
    } else {
      alert(`Ocurrió un error al ${accion}.`);
    }
  }
  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  
  
}