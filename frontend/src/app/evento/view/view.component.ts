import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '../evento';
import { EventoService } from '../evento.service';
import { AuthService } from '../../shared/auth.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

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
  estadoInscrito: boolean = false;
  usuariosInscritos: Usuario[] = [];
  permisoEvento: boolean = false;

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
    this.comprobarInscripcion();
  }

  obtenerEvento() {
    const eventoId = this.route.snapshot.paramMap.get('id');
    if (eventoId) {
      this.eventoService.show(eventoId).subscribe(
        (data: any) => {
          this.evento = data;
          this.nombreUsuario = data.user?.name || 'Desconocido';
          this.getEventoInscritos();
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
          this.tienePermisoEvento();
        });
      }
    });
  }

  esPropietario(id: any) {
    return this.usuario.id === id || this.usuario.role_id === 1;
  }

  formatearDescripcion(texto: string): SafeHtml {
    const textoConSaltos = texto.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(textoConSaltos);
  }

  inscribirse(): void {
    if (!this.isSignedIn) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.evento?.id || 0;
    this.eventoService.inscribirse(id).subscribe({
      next: () => {
        console.log('Inscripción exitosa');
        this.enviarCorreo(this.evento?.nombre || '');
        this.router.navigate(['/evento/mine']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  comprobarInscripcion(): void {
    const idString = this.route.snapshot.paramMap.get('id') ?? '';
    const id: number = +idString;
    //console.log('ID del evento:', id);
    this.eventoService.estaInscrito(id).subscribe({
      next: (data) => {
        if (data.inscrito) {
          this.estadoInscrito = true;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getEventoInscritos(): void {
    const idString = this.route.snapshot.paramMap.get('id') ?? '';
    const id: number = +idString;

    if (!this.evento || this.evento.verParticipantes == false) {
      console.log('No se pueden ver los participantes de este evento o el evento no está cargado.');
      return;
    }

    this.eventoService.getEventosInscritos(id).subscribe({
      next: (response) => {
        this.usuariosInscritos = response.data;
        //console.log('Usuarios inscritos:', this.usuariosInscritos);
      },
      error: (err) => {
        console.error('Error al obtener usuarios inscritos:', err);
      },
    });
  }

  tienePermisoEvento(): void {
    //console.log(this.usuario.role_id);
    if (this.usuario.role_id === 2) {
      this.permisoEvento = true;
    } else if (this.evento && this.evento.user_id == this.usuario.id) {
      this.permisoEvento = true;
    }
    //console.log('Permiso para editar evento:', this.permisoEvento);
  }

  onDelete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      this.eventoService.delete(id.toString()).subscribe(
        () => {
          console.log('Evento eliminado exitosamente.');
          this.router.navigate(['/evento/mine']);
        },
        (error) => {
          console.error('Error al eliminar el evento:', error);
        }
      );
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/evento/edit', id]);
  }

  onInscripciones(id: number) {
    this.router.navigate(['/evento/inscripciones', id]);
  }

  enviarCorreo(nombreEvento: string) {
      const to = this.usuario.email;

      const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color:rgb(112, 245, 205); text-align: center;">¡Te has inscrito al evento con éxito!</h2>
          <p style="font-size: 16px;">Hola <strong>${
            this.usuario.name || 'usuario'
          }</strong>,</p>
          <p style="font-size: 16px;">
            La inscripcion a <strong>"${nombreEvento}"</strong> a sido exitosa.
          </p>
          <p style="font-size: 16px;">Gracias por usar nuestra plataforma.</p>
          <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
            Este correo fue generado automáticamente. No respondas a este mensaje.
          </p>
        </div>
      </div>
    `;

      this.eventoService.sendMail(to, message).subscribe(
        (result: any) => {
          console.log('Correo de confirmación enviado exitosamente:');
        },
        (error: HttpErrorResponse) => {
          console.error('Error al enviar el correo de confirmación:', error);
        }
      );
  }
}
