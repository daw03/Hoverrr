import { Component, OnInit } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
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
  errors: any = null;

  constructor(
    private eventoService: EventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos() {
    this.eventoService.index().subscribe(
      (data: Evento[]) => {
        this.eventos = data;
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar los eventos:', error);
      }
    );
  }

  onEdit(id: number) {
    this.router.navigate(['admin/evento/edit', id]);
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
}
