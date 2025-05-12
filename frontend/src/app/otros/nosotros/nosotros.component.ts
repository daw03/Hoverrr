  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import {
    FormGroup,
    Validators,
    ReactiveFormsModule,
    FormsModule,
    FormBuilder,
  } from '@angular/forms';
  import { MailService } from '../mail.service';

  @Component({
    selector: 'app-nosotros',
    templateUrl: './nosotros.component.html',
    styleUrls: ['./nosotros.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, CommonModule],
  })
  export class NosotrosComponent {
    contactForm: FormGroup;
    mensajeEnviado = false;
    errorEnvio = false;

    constructor(
      private formBuilder: FormBuilder,
      private smtpService: MailService
    ) {
      this.contactForm = this.formBuilder.group({
        nombre: ['', Validators.required],
        texto: ['', Validators.required],
      });
    }

    onSubmit() {
      if (this.contactForm.valid) {
        const { nombre, texto } = this.contactForm.value;
        const userId = 'Usuario'; // Aquí puedes obtener el ID del usuario logueado si es necesario

        this.smtpService.enviarCorreo(nombre, texto, userId).subscribe({
          next: (response) => {
            console.log('Correo enviado exitosamente', response);
            this.mensajeEnviado = true;
            this.errorEnvio = false;
            this.contactForm.reset();
          },
          error: (error) => {
            console.error('Error al enviar el correo', error);
            this.errorEnvio = true;
            this.mensajeEnviado = false;
          },
        });
      } else {
        // Marcar todos los campos como tocados para mostrar errores
        Object.values(this.contactForm.controls).forEach(control => {
          control.markAsTouched();
        });
      }
    }
  }
