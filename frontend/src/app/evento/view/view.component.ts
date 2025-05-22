import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '../evento';
import { EventoService } from '../evento.service';
import { AuthService } from '../../shared/auth.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class Usuario {
  id!: number;
  name!: string;
  email!: string;
  role_id!: number;
}

@Component({
  selector: 'app-view-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewEventoComponent implements OnInit {
  evento: Evento | null = null; // Inicializar como null
  usuario: Usuario = new Usuario();
  isSignedIn = false;
  errorMessage: any;
  errores: any = null;
  nombreUsuario: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private eventoService: EventoService,
    private authState: AuthStateService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.obtenerEvento();
    this.verificarAuth();
  }

  obtenerEvento() {
    const eventoId = this.route.snapshot.paramMap.get('id');
    if (eventoId) {
      this.eventoService.show(eventoId).subscribe(
        (data: any) => {
          this.evento = data;
          this.nombreUsuario = data.user?.name || 'Desconocido';
        },
        (error) => {
          this.errorMessage = error;
        }
      );
    }
  }

  verificarAuth() {
    this.authState.userAuthState.subscribe((estado) => {
      this.isSignedIn = estado;
      if (this.isSignedIn) {
        this.authService.profileUser().subscribe((datos: any) => {
          this.usuario = datos;
        });
      }
    });
  }

  eliminarEvento(id: any) {
    if (id) {
      this.eventoService.delete(id.toString()).subscribe(
        () => {
          this.router.navigate(['/evento/index']);
        },
        (error) => {
          this.errores = error.error.error;
        }
      );
    }
  }

  esPropietario(id: any) {
    return this.usuario.id === id || this.usuario.role_id === 1;
  }

  formatearDescripcion(texto: string): SafeHtml {
    const textoConSaltos = texto.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(textoConSaltos);
  }

   inscribirse(): void {
    const id = this.evento?.id || 0;
    this.eventoService.inscribirse(id).subscribe({
      next: () => {
        console.log('Inscripción exitosa');
      },
      error: (err) => {
        console.error(err);
        //alert('Hubo un problema al inscribirse.');
      }
    });
  }
}
