import { Component, OnInit } from '@angular/core';
import { CineService } from './cine.service';

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

  constructor(private cineService: CineService) {}

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
    this.peliculaSeleccionada = { ...pelicula }; // Clonamos para evitar modificar directamente el objeto original
    this.mostrarLista = false; // Ocultamos la lista de películas
  }

  irACartelera(): void {
    this.mostrarLista = true;  // Mostramos la cartelera nuevamente
    this.peliculaSeleccionada = null; // Limpiamos la selección de película
  }
}
