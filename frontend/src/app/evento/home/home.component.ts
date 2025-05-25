import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../evento.service';
import { Evento } from '../evento';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  allEvents: Evento[] = [];
  nextEvents: Evento[] = [];
  isLoading = true;
  errors: any = null;

  visibleEvents: Evento[] = [];
  currentStartIndex = 0;
  itemsPerPage = 5;

  private destroy$ = new Subject<void>();

  constructor(public eventoService: EventoService, private router: Router) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUpcomingEvents(): void {
    this.eventoService
      .index()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Evento[]) => {
          this.allEvents = data;
          this.filterAndPrepareEvents();
          this.updateVisibleEvents();
          this.isLoading = false;
        },
        error: (error) => {
          this.errors = error.error.error;
          this.isLoading = false;
          console.error('Error al cargar los eventos:', error);
        },
      });
  }

  private filterAndPrepareEvents(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.nextEvents = this.allEvents
      .filter((evento) => new Date(evento.fecha_evento) >= today)
      .sort((a, b) => new Date(a.fecha_evento).getTime() - new Date(b.fecha_evento).getTime());
  }

  updateVisibleEvents(): void {
    this.visibleEvents = this.nextEvents.slice(this.currentStartIndex, this.currentStartIndex + this.itemsPerPage);
  }

  next(): void {
    if (this.currentStartIndex + 1 < this.nextEvents.length) {
      this.currentStartIndex++;
      this.updateVisibleEvents();
    }
  }

  prev(): void {
    if (this.currentStartIndex > 0) {
      this.currentStartIndex--;
      this.updateVisibleEvents();
    }
  }

  verDetalles(id: number | undefined) {
    if (typeof id === 'number') {
      this.router.navigate(['/evento/view', id]);
    }
  }
}