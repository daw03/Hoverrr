import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Importa ActivatedRoute
import { EventoService } from '../evento.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../app.component';
import { Evento } from '../evento';

interface UserInscripcion {
  id: number;
  name: string;
  email: string;
  pivot: {
    evento_id: number;
    user_id: number;
    estado: number;
  };
}

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inscripciones.component.html',
  styleUrls: ['./inscripciones.component.css'],
})
export class InscripcionesComponent implements OnInit {
  eventoId!: number;
  inscripciones: UserInscripcion[] = [];
  loading: boolean = true;
  error: string | null = null;
  user: User = new User();
  idOK: number = 0;

  constructor(
    private eventoService: EventoService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del evento de la URL
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      try {
        if (idParam) {
          this.eventoId = +idParam; // Convierte el string a number
          this.loadInscripciones();
          this.obtenerEvento();
        } else {
          this.error = 'El ID del evento no se encontró en la URL.';
          this.loading = false;
        }
      } catch (error) {
        //this.router.navigate(['/evento/index']);
      }
    });
  }
  loadInscripciones(): void {
    this.loading = true;
    this.error = null;
    this.eventoService.getEventosInscritos(this.eventoId).subscribe({
      next: (response) => {
        this.inscripciones = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar las inscripciones:', err);
        this.error =
          'No se pudieron cargar las inscripciones. Inténtalo de nuevo más tarde.';
        this.loading = false;
      },
    });
  }
  toggleEstadoInscripcion(inscripcion: UserInscripcion): void {
    const nuevoEstado = inscripcion.pivot.estado === 1 ? 0 : 1;

    this.eventoService
      .cambiarEstadoInscripcion(this.eventoId, inscripcion.id)
      .subscribe({
        next: (response) => {
          inscripcion.pivot.estado = nuevoEstado;
        },
        error: (err) => {
          console.error('Error al cambiar el estado de la inscripción:', err);
          this.error = 'No se pudo cambiar el estado de la inscripción.';
        },
      });
  }

  // Función para borrar inscripción
  borrarInscripcion(userId: number, userName: string): void {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar la inscripción de ${userName} de este evento?`
      )
    ) {
      this.eventoService.borrarInscripcion(this.eventoId, userId).subscribe({
        next: (response) => {
          console.log('Inscripción eliminada con éxito:', response);
          this.loadInscripciones(); // Recargar la lista después de borrar
        },
        error: (err) => {
          console.error('Error al eliminar la inscripción:', err);
          this.error = 'No se pudo eliminar la inscripción.';
        },
      });
    }
  }

  getEstadoText(estado: number): string {
    switch (estado) {
      case 0:
        return 'Pendiente';
      case 1:
        return 'Aceptado';
      default:
        return 'Desconocido';
    }
  }

  private getUserLoggedIn() {
    this.authService.profileUser().subscribe({
      next: (data: any) => {
        this.user = data;
        if (this.user.role_id == 0) {
          console.log('Usuario normal');
          this.router.navigate(['/evento/index']);
        } else if (
          this.user.id != this.idOK
        ) {
          this.router.navigate(['/evento/index']);
        }
      },
    });
  }

  obtenerEvento() {
    if (this.eventoId) {
      
      this.eventoService.show(this.eventoId.toString()).subscribe((data: any) => {
        this.idOK = data.user_id; 
        this.getUserLoggedIn();
      });
    }
  }
}
