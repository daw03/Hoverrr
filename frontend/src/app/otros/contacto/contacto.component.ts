import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { MailService } from '../mail.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../app.component';
import { EventoService } from '../../evento/evento.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class ContactoComponent implements OnInit {
  contactForm: FormGroup;
  mensajeEnviado = false;
  errorEnvio = false;
  usuario: User = new User();
  autenticado = false;

  constructor(
    private formBuilder: FormBuilder,
    private smtpService: MailService,
    private eventoService: EventoService,
    private authService: AuthService
  ) {
    this.contactForm = this.formBuilder.group({
      texto: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargaUsuario();
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const { texto } = this.contactForm.value;
      this.enviarCorreo(texto);
    } else {
      Object.values(this.contactForm.controls).forEach(control =>
        control.markAsTouched()
      );
    }
  }

  enviarCorreo(mensaje: string) {
      const to = "daw03.2024@gmail.com"; //Hardcodeado el mail del administrador

      const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color:rgb(112, 245, 205); text-align: center;">Mensaje de contacto</h2>
          <p style="font-size: 16px;">Mensaje de <strong>${
            this.usuario.name || 'usuario'
          }</strong>,</p>
           <p style="font-size: 16px;">Con ID:  <strong>${
            this.usuario.id || 'id no disponible'
          }</strong>,</p>
          <p style="font-size: 16px;">
            ${
            mensaje || 'No se proporcionó un mensaje.'
          }
          </p>
          <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
            Este correo fue generado automáticamente. No respondas a este mensaje.
          </p>
        </div>
      </div>
    `;

      this.eventoService.sendMail(to, message).subscribe(
        (result: any) => {
          console.log('Correo de confirmación enviado exitosamente:');
        },
        (error: HttpErrorResponse) => {
          console.error('Error al enviar el correo de confirmación:', error);
        }
      );
  }

  cargaUsuario() {
    this.authService.profileUser().subscribe({
      next: (data: User) => {
        this.usuario = data;
        this.autenticado = true;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar el usuario:', error);
      },
    });
  }
}
