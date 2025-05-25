import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../../shared/token.service';
import { EventoService } from '../../evento/evento.service';
import { Evento } from '../../evento/evento';
import { AuthService } from '../../shared/auth.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { User } from '../../app.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})

export class CreateEventoComponent implements OnInit, OnDestroy {
  eventoForm!: FormGroup; // Declara, pero no inicializa aquí
  errors: any = null;
  evento!: Evento;
  selectedImage!: any;
  isSignedIn!: boolean;
  user: User = new User();
  categorias: { id: number; nombre: string; created_at: string | null; updated_at: string | null }[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authState: AuthStateService,
    private authService: AuthService,
    public router: Router,
    public eventoService: EventoService,
    public token: TokenService
  ) {}

  ngOnInit(): void {
    // 1. form
    this.eventoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
      fecha_evento: new FormControl('', [Validators.required]),
      categoria_id: new FormControl('', [Validators.required]),
      ubicacion: new FormControl('', [Validators.required]),
      precio: new FormControl(null),
      premios: new FormControl(''),
      inscripcion_abierta: new FormControl(false),
      verParticipantes: new FormControl(false),
      file: new FormControl('', [Validators.required]),
    });

    // 2. user
    this.checkAuthAndLoadUser();

    // 3. categorias
    this.loadCategorias();

    this.isSignedIn = this.token.isLoggedIn();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAuthAndLoadUser() {
    if (this.token.isLoggedIn()) {
      this.authState.setAuthState(true);
      this.getUserLoggedIn();
    } else {
      // Si no está logueado, redirige inmediatamente
      this.router.navigate(['/evento/index']);
    }
  }

  private getUserLoggedIn() {
    this.authService
      .profileUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.user = data;
          if (this.user.role_id?.toString() === '0') {
            this.router.navigate(['/evento/index']);
          }
        },
        error: (error) => {
          console.error('Error al cargar el perfil del usuario', error);
          this.authState.setAuthState(false);
          this.token.removeToken();
          this.router.navigate(['/evento/index']);
        },
      });
  }

  private loadCategorias(): void {
    this.eventoService.categorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.categorias = data;
          //console.log('Categorías cargadas:', this.categorias);
        },
        error: (error) => {
          console.error('Error al cargar las categorías:', error);
        }
      });
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
      eventoData.append(
        'verParticipantes',
        this.eventoForm.value.verParticipantes ? '1' : '0'
      );
      eventoData.append('file', this.selectedImage);

      if (this.token.isLoggedIn()) {
        this.eventoService.create(eventoData).subscribe(
          (result: any) => {
            console.log('Evento creado exitosamente:', result);
            this.eventoForm.reset();
            this.router.navigate(['/evento/index']);
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