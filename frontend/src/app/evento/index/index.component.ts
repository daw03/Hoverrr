import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../evento.service';
import { Evento } from '../evento';
import { AuthStateService } from '../../shared//auth-state.service';
import { AuthService } from '../../shared/auth.service';
import { Router, RouterModule } from '@angular/router';

export class User {
  id!: number;
  role_id!: number;
  name!: String;
  email!: String;
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  isSignedIn!: boolean;
  eventos: Evento[] = []; // Mantener el array completo si lo necesitas para otras cosas
  eventosRecientes: Evento[] = []; // Para los 4 eventos más recientes de todas las categorías
  eventosCarreras: Evento[] = []; // Para los 4 eventos más recientes de Categoría 1
  eventosFreestyle: Evento[] = []; // Para los 4 eventos más recientes de Categoría 2
  isLoading = true;
  user: User = new User();
  errors: any = null;

  constructor(
    public eventoService: EventoService,
    private auth: AuthStateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.eventoService.index().subscribe(
      (data: any) => {
        this.eventos = data;

        // 1. Obtener los 4 eventos más recientes de todas las categorías
        this.eventosRecientes = this.eventos
          .sort((a, b) => new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime())
          .slice(0, 4);

        // 2. Filtrar y obtener los 4 eventos más recientes para Categoría 1 (Carreras)
        this.eventosCarreras = this.eventos
          .filter(evento => evento.categoria_id === 1) // Filtra por categoria_id = 1
          .sort((a, b) => new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime())
          .slice(0, 4);

        // 3. Filtrar y obtener los 4 eventos más recientes para Categoría 2 (Freestyle)
        this.eventosFreestyle = this.eventos
          .filter(evento => evento.categoria_id === 2) // Filtra por categoria_id = 2
          .sort((a, b) => new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime())
          .slice(0, 4);

        this.isLoading = false;
      },
      (error) => {
        this.errors = error.error.error;
        this.isLoading = false;
      }
    );
    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
      if (this.isSignedIn) {
        this.authService.profileUser().subscribe((data: any) => {
          this.user = data;
        });
      }
    });
  }

  ngOnInit(): void {}

  verDetalles(id: number | undefined) {
    if (typeof id === 'number') {
      this.router.navigate(['/evento/view', id]);
    }
  }

  isEventPassed(eventDate: string): boolean {
    const today = new Date();
    // Normalizamos la fecha de hoy a medianoche para comparar solo por día
    today.setHours(0, 0, 0, 0);

    const eventDateTime = new Date(eventDate);
    // Normalizamos la fecha del evento a medianoche para comparar solo por día
    eventDateTime.setHours(0, 0, 0, 0);

    return eventDateTime < today;
  }
}