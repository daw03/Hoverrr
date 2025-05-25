import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../evento.service';
import { Evento } from '../evento';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Categoria {
  id: number;
  nombre: string;
  created_at: string | null;
  updated_at: string | null;
}

@Component({
  selector: 'app-minecreated',
  templateUrl: './minecreated.component.html',
  styleUrl: './minecreated.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class MinecreatedComponent {
  eventos: Evento[] = [];
  filteredEventos: Evento[] = [];
  paginatedEvents: Evento[] = [];
  categorias: Categoria[] = [];
  selectedCategoryId: number | null = null;
  isLoading = true;
  errors: any = null;

  currentPage: number = 1;
  itemsPerPage: number = 16;
  totalPages: number = 0;

  private destroy$ = new Subject<void>();

  constructor(public eventoService: EventoService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEvents(): void {
    this.eventoService
      .miseventoscreados()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.eventos = data;
          this.filterEvents();
          this.isLoading = false;
        },
        error: (error) => {
          this.errors = error.error.error;
          this.isLoading = false;
          console.error('Error al cargar los eventos:', error);
        },
      });
  }

  private loadCategorias(): void {
    this.eventoService
      .categorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.categorias = data;
          //console.log('Categorías cargadas:', this.categorias);
        },
        error: (error) => {
          console.error('Error al cargar las categorías:', error);
        },
      });
  }

  filterEvents(): void {
    let tempEvents: Evento[];

    if (this.selectedCategoryId === null) {
      tempEvents = [...this.eventos];
    } else {
      tempEvents = this.eventos.filter(
        (evento) => evento.categoria_id === this.selectedCategoryId
      );
    }
    tempEvents.sort(
      (a, b) =>
        new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime()
    );

    this.filteredEventos = tempEvents;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(
      this.filteredEventos.length / this.itemsPerPage
    );
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.filteredEventos.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getEventCountByCategory(categoryId: number): number {
    if (!this.eventos) {
      return 0;
    }
    return this.eventos.filter((evento) => evento.categoria_id === categoryId)
      .length;
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.filterEvents();
  }

  verDetalles(id: number | undefined) {
    if (typeof id === 'number') {
      this.router.navigate(['/evento/view', id]);
    }
  }

  isEventPassed(eventDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(0, 0, 0, 0);
    return eventDateTime < today;
  }
}
