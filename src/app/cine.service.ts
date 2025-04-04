import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CineService {

  private apiUrl = 'https://cartelera-backend.onrender.com/movies';  // URL modificada
  private loginUrl = 'https://cartelera-backend.onrender.com/login';  // URL modificada
  private ftpUrl = 'https://cartelera-backend.onrender.com';  // URL modificada

  constructor(private http: HttpClient) { }

  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  private createAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  // === Películas ===

  getCartelera(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.createAuthHeaders() });
  }

  getPeliculaDetalles(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.createAuthHeaders() });
  }

  agregarPelicula(pelicula: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pelicula, { headers: this.createAuthHeaders() });
  }

  editarPelicula(id: string, pelicula: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pelicula, { headers: this.createAuthHeaders() });
  }

  eliminarPelicula(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.createAuthHeaders() });
  }

  // === FTP ===

  uploadFile(file: FormData): Observable<any> {
    return this.http.post(`${this.ftpUrl}/upload`, file, { headers: this.createAuthHeaders() });
  }

  listFiles(): Observable<any> {
    return this.http.get(`${this.ftpUrl}/list`, { headers: this.createAuthHeaders() });
  }

  deleteFile(fileName: string): Observable<any> {
    const headers = this.createAuthHeaders().set('Content-Type', 'application/json');
    return this.http.request('delete', `${this.ftpUrl}/delete`, {
      headers,
      body: { fileName }
    });
  }

  // Si tus imágenes se sirven en una ruta tipo: http://localhost:3000/files/nombre.jpg
  getFileUrl(fileName: string): string {
    return `${this.ftpUrl}/files/${encodeURIComponent(fileName)}`;
  }

  // === Email ===

  sendEmail(emailData: { to: string, subject: string, text: string }): Observable<any> {
    return this.http.post(`${this.ftpUrl}/enviar`, emailData, { headers: this.createAuthHeaders() });
  }

  // === Login ===

  login(strNombre: string, strPwd: string): Observable<any> {
    return this.http.post(`${this.loginUrl}`, { strNombre, strPwd });
  }

  // === Edición de Películas ===

  peliculaEnEdicion: any = null;

  empezarEdicionPelicula(pelicula: any): void {
    this.peliculaEnEdicion = { ...pelicula };
  }

  guardarCambiosPelicula(): void {
    if (this.peliculaEnEdicion) {
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
