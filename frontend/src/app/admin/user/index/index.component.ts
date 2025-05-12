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
  imports: [CommonModule, ],
})
export class IndexUserComponent implements OnInit {
  users: User[] = [];
  errors: any = null;

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
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar los usuarios:', error);
      }
    );
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
    this.router.navigate(['admin/user/edit', id]);
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
