import { Component, OnInit } from '@angular/core';
import { CineService } from './cine.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cartelera',
  templateUrl: './cartelera.component.html',
  styleUrls: ['./cartelera.component.css']
})
export class CarteleraComponent implements OnInit {
  cartelera: any[] = [];
  loading: boolean = true;
  mostrarLista: boolean = true;
  peliculaSeleccionada: any = null;

  constructor(
    private cineService: CineService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.obtenerCartelera();
  }

  obtenerCartelera(): void {
    this.loading = true;
    this.cineService.getCartelera().subscribe({
      next: (data) => {
        this.cartelera = data;
        this.loading = false;
      },
      error: () => {
        console.error('Error al obtener la cartelera');
        this.loading = false;
      }
    });
  }

  verDetallesPelicula(pelicula: any): void {
    this.peliculaSeleccionada = pelicula;
    this.mostrarLista = false;
  }

  getSafeYoutubeUrl(url: string): SafeResourceUrl | null {
    if (!url) return null;
    
    try {
      const videoId = this.extractYoutubeId(url);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } catch (error) {
      console.error('Error al procesar URL de YouTube:', error);
      return null;
    }
  }

  private extractYoutubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (!match || match[2].length !== 11) {
      throw new Error('URL de YouTube no válida');
    }
    
    return match[2];
  }

  irACartelera(): void {
    this.mostrarLista = true;
    this.peliculaSeleccionada = null;
  }
}