import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
//import { Evento } from './evento';

@Injectable({
  providedIn: 'root'
})

export class EventoService {
  constructor(private http: HttpClient) {}

  create(evento: FormData): Observable<any> {
    const headers= new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post('http://127.0.0.1:8000/api/eventos', evento,( {headers: headers}));
  }

  index(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/eventos');
  }

  show(id: string): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/eventos/${id}`);
  }

  myPeticiones(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/eventos/mine')
  }

  // Borrar
  delete(id: string): Observable<any> {
    return this.http.delete(`http://127.0.0.1:8000/api/eventos/${id}`, {});
  }

  // Actualizar
  update(id: string, evento: FormData): Observable<any> {
    return this.http.put(`http://127.0.0.1:8000/api/eventos/${id}`, evento);
  }
}

