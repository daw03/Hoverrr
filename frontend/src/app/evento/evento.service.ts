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
    return this.http.post('http://98.66.153.140/api/api/eventos', evento, {
      headers: headers,
    });
  }

  index(): Observable<any> {
    return this.http.get('http://98.66.153.140/api/api/eventos');
  }

  list(): Observable<any> {
    return this.http.get('http://98.66.153.140/api/api/eventoslist');
  }

  miseventos(): Observable<any> {
    return this.http.get('http://98.66.153.140/api/api/eventos/inscrito');
  }

  show(id: string): Observable<any> {
    return this.http.get(`http://98.66.153.140/api/api/eventos/${id}`);
  }

  miseventoscreados(): Observable<any> {
    return this.http.get('http://98.66.153.140/api/api/eventos/mine');
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`http://98.66.153.140/api/api/eventos/${id}`, {});
  }

  update(id: string, evento: FormData): Observable<any> {
    evento.append('_method', 'PUT');
    return this.http.post(`http://98.66.153.140/api/api/eventos/${id}`, evento);
  }

  categorias(): Observable<any> {
    return this.http.get('http://98.66.153.140/api/api/categorias');
  }

  inscribirse(id: number): Observable<any> {
    return this.http.post(
      `http://98.66.153.140/api/api/eventos/${id}/inscribirse/`,
      {}
    );
  }

  cambiarEstado(id: number): Observable<any> {
    return this.http.put(
      `http://98.66.153.140/api/api/eventos/${id}/cambiar-estado`,
      {}
    );
  }

  estaInscrito(id: number): Observable<any> {
    return this.http.get(
      `http://98.66.153.140/api/api/eventos/${id}/estainscrito`
    );
  }

  getEventosInscritos(id: number): Observable<any> {
    return this.http.get(`http://98.66.153.140/api/api/eventos/${id}/usuarios`);
  }

  cambiarEstadoInscripcion(id: number, userId: number): Observable<any> {
    return this.http.put(
      `http://98.66.153.140/api/api/eventos/${id}/usuarios/${userId}/estado`,
      {}
    );
  }

  borrarInscripcion(id: number, userId: number): Observable<any> {
    return this.http.delete(
      `http://98.66.153.140/api/api/eventos/${id}/usuarios/${userId}/desinscribir`,
      {}
    );
  }

  sendMail(to: string, message: string) {
    const body = { to, message };
    return this.http.post('http://98.66.153.140/api/api/sendmail', body);
  }
}
