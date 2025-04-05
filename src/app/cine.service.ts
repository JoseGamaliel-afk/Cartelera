import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CineService {

  private baseUrl = 'https://cartelera-backend.onrender.com';
  private apiUrl = `${this.baseUrl}/movies`;
  private loginUrl = `${this.baseUrl}/login`;

  constructor(private http: HttpClient) { }

  // Obtener token desde localStorage
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  // Crear headers con autorización
  private createAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`,
      'Content-Type': 'application/json'
    });
  }

  // GET: cartelera
  getCartelera(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.createAuthHeaders() });
  }

  // GET: detalles de una película
  getPeliculaDetalles(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.createAuthHeaders() });
  }

  // POST: agregar película
  agregarPelicula(pelicula: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pelicula, { headers: this.createAuthHeaders() });
  }

  // PUT: editar película
  editarPelicula(id: string, pelicula: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pelicula, { headers: this.createAuthHeaders() });
  }

  // DELETE: eliminar película
  eliminarPelicula(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.createAuthHeaders() });
  }

  // POST: subir archivo
  uploadFile(file: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
      // NO incluir Content-Type con FormData
    });
    return this.http.post(`${this.baseUrl}/upload`, file, { headers });
  }

  // GET: listar archivos
  listFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`, { headers: this.createAuthHeaders() });
  }

  // DELETE: eliminar archivo
  deleteFile(fileName: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}/delete`, {
      body: { fileName },
      headers: this.createAuthHeaders()
    });
  }

  // POST: enviar correo
  sendEmail(emailData: { to: string, subject: string, text: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/enviar`, emailData, { headers: this.createAuthHeaders() });
  }

  // POST: login
  login(strNombre: string, strPwd: string): Observable<any> {
    return this.http.post(`${this.loginUrl}`, { strNombre, strPwd });
  }

  // --- Lógica local para edición de película ---
  peliculaEnEdicion: any = null;

  empezarEdicionPelicula(pelicula: any): void {
    this.peliculaEnEdicion = { ...pelicula };
  }

  guardarCambiosPelicula(): void {
    if (this.peliculaEnEdicion && this.peliculaEnEdicion.id) {
      this.editarPelicula(this.peliculaEnEdicion.id, this.peliculaEnEdicion).subscribe(
        (response) => {
          console.log('Película actualizada:', response);
          this.peliculaEnEdicion = null;
        },
        (error) => {
          console.error('Error al guardar los cambios:', error);
        }
      );
    }
  }

  cancelarEdicion(): void {
    this.peliculaEnEdicion = null;
  }
}
