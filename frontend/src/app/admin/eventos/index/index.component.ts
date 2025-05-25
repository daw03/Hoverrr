import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { EventoService } from '../../../evento/evento.service';
import { Evento } from '../../../evento/evento';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class IndexEventoComponent implements OnInit {
  eventos: Evento[] = [];
  eventosPaginados: Evento[] = [];
  errors: any = null;

  // Variables de paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  totalPaginas: number = 1;

  constructor(
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos() {
    this.eventoService.list().subscribe(
      (data: Evento[]) => {
        this.eventos = data;
        this.totalPaginas = Math.ceil(this.eventos.length / this.itemsPorPagina);
        this.actualizarPaginacion();
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar los eventos:', error);
      }
    );
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.eventosPaginados = this.eventos.slice(inicio, fin);
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  anteriorPagina(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  onEdit(id: number) {
    this.router.navigate(['admin/eventos/edit', id]);
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventoService.delete(id.toString()).subscribe(
        () => {
          console.log('Evento eliminado exitosamente.');
          this.loadEventos();
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al eliminar el evento:', error);
        }
      );
    }
  }

  cambiarEstado(id: number) {
    this.eventoService.cambiarEstado(id).subscribe(
      () => {
        console.log('Estado del evento cambiado exitosamente.');
        this.loadEventos();
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cambiar el estado del evento:', error);
      }
    );
  }
}
