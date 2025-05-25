import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core'; // Importa OnDestroy
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventoService } from '../../../evento/evento.service';
import { Evento } from '../../../evento/evento';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class EditComponent {
  eventoForm!: FormGroup;
  eventoId!: string;
  errors: any = null;
  selectedImage: File | null = null;
  evento!: Evento;
  // Definimos el tipo de la categoría directamente aquí, si no quieres una interfaz aparte
  categorias: {
    id: number;
    nombre: string;
    created_at: string | null;
    updated_at: string | null;
  }[] = [];
  private destroy$ = new Subject<void>(); // Para desuscribirse de los observables

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Siempre inicializa el formulario PRIMERO
    this.eventoForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required),
      fecha_evento: new FormControl('', Validators.required),
      categoria_id: new FormControl('', Validators.required),
      ubicacion: new FormControl('', Validators.required),
      premios: new FormControl(''),
      inscripcion_abierta: new FormControl(false),
      verParticipantes: new FormControl(false),
      precio: new FormControl(null),
    });

    // Carga las categorías al iniciar el componente
    this.loadCategorias();

    if (id) {
      this.eventoId = id;

      this.eventoService
        .show(this.eventoId)
        .pipe(takeUntil(this.destroy$)) // Usa takeUntil para desuscribirse
        .subscribe({
          next: (data: any) => {
            this.evento = Array.isArray(data) ? data[0] : data;

            if (!this.evento) {
              this.errors = 'Evento no encontrado.';
              this.router.navigate(['/evento/index']);
              return;
            }

            // Aquí es donde estableces los valores del formulario
            this.eventoForm.patchValue({
              nombre: this.evento.nombre,
              descripcion: this.evento.descripcion,
              // Formatear la fecha para que el input type="date" la acepte
              fecha_evento: this.evento.fecha_evento
                ? new Date(this.evento.fecha_evento)
                    .toISOString()
                    .substring(0, 10)
                : '',
              categoria_id: this.evento.categoria_id, // Asegura que esta propiedad coincida con el ID de la categoría
              ubicacion: this.evento.ubicacion,
              premios: this.evento.premios,
              inscripcion_abierta: this.evento.inscripcion_abierta,
              verParticipantes: this.evento.verParticipantes,
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

  ngOnDestroy(): void {
    // Asegúrate de desuscribirte cuando el componente se destruya
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Nuevo método para cargar las categorías
  private loadCategorias(): void {
    this.eventoService
      .categorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.categorias = data;
          //console.log('Categorías cargadas para editar:', this.categorias);
          if (this.evento && this.evento.categoria_id && this.eventoForm) {
            this.eventoForm
              .get('categoria_id')
              ?.setValue(this.evento.categoria_id);
          }
        },
        error: (error) => {
          console.error('Error al cargar las categorías:', error);
        },
      });
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
      formData.append(
        'verParticipantes',
        this.eventoForm.value.verParticipantes ? '1' : '0'
      );
      if (this.eventoForm.value.precio !== null) {
        formData.append('precio', this.eventoForm.value.precio.toString());
      }
      if (this.selectedImage) {
        formData.append('file', this.selectedImage);
      }
      // Importante para Laravel: si usas put/patch y FormData, añade _method
      formData.append('_method', 'PUT');

      this.eventoService.update(this.eventoId, formData).subscribe({
        next: () => {
          this.router.navigate(['admin/eventos']);
        },
        error: (error: HttpErrorResponse) => {
          this.errors = error.error;
        },
      });
    }
  }
}
