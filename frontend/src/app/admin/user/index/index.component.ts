import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class IndexUserComponent implements OnInit {
  users: User[] = [];
  usersPaginados: User[] = [];
  errors: any = null;

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  totalPaginas: number = 1;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.index().subscribe(
      (data: User[]) => {
        this.users = data;
        this.totalPaginas = Math.ceil(this.users.length / this.itemsPorPagina);
        this.actualizarPaginacion();
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  actualizarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.usersPaginados = this.users.slice(inicio, fin);
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

  getRoleName(roleId: number): string {
    switch (roleId.toString()) {
      case "0":
        return 'Usuario';
      case "1":
        return 'Organizador';
      case "2":
        return 'Administrador';
      default:
        return 'Desconocido';
    }
  }

  onEdit(id: number) {
    this.router.navigate(['admin/users/edit', id]);
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.delete(id).subscribe(
        () => {
          console.log('Usuario eliminado exitosamente.');
          this.loadUsers();
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }
}
