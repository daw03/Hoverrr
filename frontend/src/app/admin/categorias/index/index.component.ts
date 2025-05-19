import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class IndexCategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriasPaginadas: Categoria[] = [];
  errors: any = null;

  // Variables de paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  totalPaginas: number = 1;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoriaService.index().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
        this.totalPaginas = Math.ceil(this.categorias.length / this.itemsPorPagina);
        this.actualizarPaginacion();
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.categoriasPaginadas = this.categorias.slice(inicio, fin);
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
    this.router.navigate(['admin/categorias/edit', id]);
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categoriaService.delete(id).subscribe(
        () => {
          console.log('Categoría eliminada exitosamente.');
          this.loadCategorias();
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al eliminar la categoría:', error);
        }
      );
    }
  }
}
