import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private apiUrl = 'http://98.66.153.140/api/api/sendmail';

  constructor(private http: HttpClient) {}

  enviarCorreo(nombre: string, mensaje: string, asunto: string): Observable<any> {
    const body = {
      to: 'info@hoverrr.com',
      subject: `Asunto: ${asunto}`,
      message: `Nombre: ${nombre} <br><br> Mensaje: ${mensaje}`,
    };
    return this.http.post(this.apiUrl, body);
  }
}
