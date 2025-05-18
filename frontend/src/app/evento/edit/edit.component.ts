import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventoService } from '../../evento/evento.service';
import { Evento } from '../../evento/evento';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class EditEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  eventoId!: string;
  errors: any = null;
  selectedImage: File | null = null;
  evento!: Evento;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.eventoId = id;

      // Inicializa el formulario
      this.eventoForm = new FormGroup({
        nombre: new FormControl('', Validators.required),
        descripcion: new FormControl('', Validators.required),
        fecha_evento: new FormControl('', Validators.required),
        categoria_id: new FormControl('', Validators.required),
        ubicacion: new FormControl('', Validators.required),
        premios: new FormControl(''),
        inscripcion_abierta: new FormControl(false),
        precio: new FormControl(null),
      });

      this.eventoService.show(this.eventoId).subscribe({
        next: (data: any) => {
          this.evento = Array.isArray(data) ? data[0] : data;

          if (!this.evento) {
            this.errors = 'Evento no encontrado.';
            this.router.navigate(['/evento/index']);
            return;
          }

          this.eventoForm.patchValue({
            nombre: this.evento.nombre,
            descripcion: this.evento.descripcion,
            fecha_evento: this.evento.fecha_evento,
            categoria_id: this.evento.categoria_id,
            ubicacion: this.evento.ubicacion,
            premios: this.evento.premios,
            inscripcion_abierta: this.evento.inscripcion_abierta,
            precio: this.evento.precio,
          });
        },
        error: () => {
          this.errors = 'No se pudo cargar el evento para editar.';
          this.router.navigate(['/evento/index']);
        },
      });
    } else {
      this.errors = 'ID de evento no proporcionado.';
      this.router.navigate(['/evento/index']);
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  onSubmit(): void {
    console.log(this.eventoForm.value);
    if (this.eventoForm.valid) {
      const formData = new FormData();
      formData.append('nombre', this.eventoForm.value.nombre);
      formData.append('descripcion', this.eventoForm.value.descripcion);
      formData.append('fecha_evento', this.eventoForm.value.fecha_evento);
      formData.append('categoria_id', this.eventoForm.value.categoria_id);
      formData.append('ubicacion', this.eventoForm.value.ubicacion);
      formData.append('premios', this.eventoForm.value.premios || '');
      formData.append(
        'inscripcion_abierta',
        this.eventoForm.value.inscripcion_abierta ? '1' : '0'
      );
      if (this.eventoForm.value.precio !== null) {
        formData.append('precio', this.eventoForm.value.precio.toString());
      }
      if (this.selectedImage) {
        formData.append('file', this.selectedImage);
      }

      this.eventoService.update(this.eventoId, formData).subscribe({
        next: () => {
          this.router.navigate(['/evento/index']);
        },
        error: (error: HttpErrorResponse) => {
          this.errors = error.error;
        },
      });
    }
  }
}
