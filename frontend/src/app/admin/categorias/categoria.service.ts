import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://98.66.153.140/api/api/categorias';

  constructor(private http: HttpClient) {}

  create(categoria: any): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

  index(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  show(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  update(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
