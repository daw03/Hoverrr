import { Component, OnInit } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
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
  errors: any = null;

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
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  onEdit(id: number) {
    this.router.navigate(['admin/categoria/edit', id]);
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
