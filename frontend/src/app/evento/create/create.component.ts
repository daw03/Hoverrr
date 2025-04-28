import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../../shared/token.service';
import { EventoService } from '../../evento/evento.service';
import { Evento } from '../../evento/evento';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class CreateEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  errors: any = null;
  evento!: Evento;
  isSignedIn!: boolean;
  selectedImage!: any;

  constructor(
    public router: Router,
    public eventoService: EventoService,
    public token: TokenService
  ) {}

  ngOnInit(): void {
    this.eventoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fecha_evento: new FormControl('', [Validators.required]),
      categoria_id: new FormControl('', [Validators.required]),
      ubicacion: new FormControl('', [Validators.required]),
      precio: new FormControl(null),
      premios: new FormControl(''),
      inscripcion_abierta: new FormControl(false),
      file: new FormControl('', [Validators.required]),
    });
    this.isSignedIn = this.token.isLoggedIn();
  }

  onSubmit() {
    if (this.eventoForm.valid) {
      const eventoData = new FormData();
      eventoData.append('nombre', this.eventoForm.value.nombre);
      eventoData.append('descripcion', this.eventoForm.value.descripcion);
      eventoData.append('fecha_evento', this.eventoForm.value.fecha_evento);
      eventoData.append('categoria_id', this.eventoForm.value.categoria_id);
      eventoData.append('ubicacion', this.eventoForm.value.ubicacion);
      if (this.eventoForm.value.precio !== null) {
        eventoData.append('precio', this.eventoForm.value.precio.toString());
      }
      eventoData.append('premios', this.eventoForm.value.premios);
      eventoData.append(
        'inscripcion_abierta',
        this.eventoForm.value.inscripcion_abierta ? '1' : '0'
      );
      eventoData.append('file', this.selectedImage);

      if (this.token.isLoggedIn()) {
        this.eventoService.create(eventoData).subscribe(
          (result: any) => {
            console.log('Evento creado exitosamente:', result);
            this.eventoForm.reset();
            this.router.navigate(['/eventos']);
          },
          (error: HttpErrorResponse) => {
            this.errors = error.error;
            console.error('Error al crear evento:', error);
          }
        );
      }
    }
  }

  metoImagen(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }
}