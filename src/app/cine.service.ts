import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CineService {
  private baseUrl = 'https://cartelera-backend.onrender.com';
  private apiUrl = `${this.baseUrl}/movies`;
  private loginUrl = `${this.baseUrl}/login`;

  constructor(private http: HttpClient) { }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  private createAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    if (!token) {
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Error:', error);
    return throwError(() => error);
  }

  getCartelera(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getPeliculaDetalles(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  agregarPelicula(pelicula: any): Observable<any> {
    return this.http.post(this.apiUrl, pelicula, { 
      headers: this.createAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  editarPelicula(id: string, pelicula: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pelicula, { 
      headers: this.createAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  eliminarPelicula(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.createAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  uploadFile(file: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, file, { 
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getAuthToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  listFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`, { 
      headers: this.createAuthHeaders() 
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteFile(fileName: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete`, {
      body: { fileName },
      headers: this.createAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  login(strNombre: string, strPwd: string): Observable<any> {
    return this.http.post(this.loginUrl, { strNombre, strPwd }).pipe(
      catchError(this.handleError)
    );
  }

  // Lógica local para edición
  peliculaEnEdicion: any = null;

  empezarEdicionPelicula(pelicula: any): void {
    this.peliculaEnEdicion = { ...pelicula };
  }

  guardarCambiosPelicula(): void {
    if (this.peliculaEnEdicion?.id) {
      this.editarPelicula(
        this.peliculaEnEdicion.id, 
        this.peliculaEnEdicion
      ).subscribe({
        next: () => this.peliculaEnEdicion = null,
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  cancelarEdicion(): void {
    this.peliculaEnEdicion = null;
  }
}