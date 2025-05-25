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
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class ContactoComponent {
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
      const userId = 'Usuario';

      this.smtpService.enviarCorreo(nombre, texto, userId).subscribe({
        next: () => {
          this.mensajeEnviado = true;
          this.errorEnvio = false;
          this.contactForm.reset();
        },
        error: () => {
          this.errorEnvio = true;
          this.mensajeEnviado = false;
        },
      });
    } else {
      Object.values(this.contactForm.controls).forEach(control =>
        control.markAsTouched()
      );
    }
  }
}
