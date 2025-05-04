import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../shared/token.service';
import { EventoService } from '../../evento/evento.service';
import { Evento } from '../evento';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class EditEventoComponent {
  eventoForm!: FormGroup;
  errors: any = null;
  evento: Evento | null = null;
  selectedImage: any;
  imageUrl: string | null = null;

  constructor(
    public router: Router,
    public eventoService: EventoService,
    public token: TokenService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const eventoId = this.route.snapshot.paramMap.get('id');
    if (eventoId) {
      this.eventoService.show(eventoId).subscribe(
        (data: any) => {
          this.evento = data;
          this.imageUrl = data.file?.file_path
            ? `http://127.0.0.1:8000/storage/${data.file.file_path}`
            : null;
          this.populateForm();
        },
        (error) => {
          console.error('Error fetching evento:', error);
        }
      );
    } else {
      // No se proporcionó el ID, redirigir o mostrar un error
    }

    this.eventoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fecha_evento: new FormControl('', [Validators.required]),
      categoria_id: new FormControl('', [Validators.required]),
      ubicacion: new FormControl('', [Validators.required]),
      precio: new FormControl(null),
      premios: new FormControl(''),
      inscripcion_abierta: new FormControl(false),
      file: new FormControl(null),
    });
  }

  populateForm() {
    if (this.evento) {
      this.eventoForm.patchValue({
        nombre: this.evento.nombre,
        descripcion: this.evento.descripcion,
        fecha_evento: this.evento.fecha_evento
          ? this.evento.fecha_evento.substring(0, 10)
          : '',
        categoria_id: this.evento.categoria_id,
        ubicacion: this.evento.ubicacion,
        precio: this.evento.precio,
        premios: this.evento.premios,
        inscripcion_abierta: this.evento.inscripcion_abierta,
      });
    }
  }

  onSubmit() {
    if (this.eventoForm.valid && this.evento?.id) {
      const eventoId = this.evento.id.toString();
      const eventoData = new FormData();
      eventoData.append('nombre', this.eventoForm.value.nombre!);
      eventoData.append('descripcion', this.eventoForm.value.descripcion!);
      eventoData.append('fecha_evento', this.eventoForm.value.fecha_evento!);
      eventoData.append('categoria_id', this.eventoForm.value.categoria_id!);
      eventoData.append('ubicacion', this.eventoForm.value.ubicacion!);
      if (this.eventoForm.value.precio !== null) {
        eventoData.append('precio', this.eventoForm.value.precio.toString());
      }
      if (this.eventoForm.value.premios) {
        eventoData.append('premios', this.eventoForm.value.premios);
      }
      eventoData.append(
        'inscripcion_abierta',
        this.eventoForm.value.inscripcion_abierta ? '1' : '0'
      );
      if (this.selectedImage) {
        eventoData.append('file', this.selectedImage);
      }

      this.eventoService.update(eventoId, eventoData).subscribe(
        (result: any) => {
          console.log('Evento actualizado exitosamente:', result);
          this.router.navigate(['/evento/view', eventoId]);
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al actualizar evento:', error);
        }
      );
    }
  }

  metoImagen(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }
}
