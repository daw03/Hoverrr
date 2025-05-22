import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Evento } from './evento';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  constructor(private http: HttpClient) {}

  create(evento: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post('http://127.0.0.1:8000/api/eventos', evento, {
      headers: headers,
    });
  }

  index(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/eventos');
  }

  miseventos(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/eventos/inscrito');
  }

  show(id: string): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/eventos/${id}`);
  }

  myPeticiones(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/eventos/mine');
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`http://127.0.0.1:8000/api/eventos/${id}`, {});
  }

  update(id: string, evento: FormData): Observable<any> {
    evento.append('_method', 'PUT');
    return this.http.post(`http://127.0.0.1:8000/api/eventos/${id}`, evento);
  }

  categorias(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/categorias');
  }

  inscribirse(id: number): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/api/eventos/${id}/inscribirse/`, {});
  }
}
