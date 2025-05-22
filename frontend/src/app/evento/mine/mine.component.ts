import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../evento.service';
import { Evento } from '../evento';
import { AuthStateService } from '../../shared//auth-state.service';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

export class User {
  id!: number;
  role_id!: number;
  name!: String;
  email!: String;
}

@Component({
  selector: 'app-mine',
  templateUrl: './mine.component.html',
  styleUrl: './mine.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class MineComponent implements OnInit {
  isSignedIn!: boolean;
  eventos: Evento[] = [];
  isLoading = true;
  user: User = new User();
  errors: any = null;

  constructor(
    public eventoService: EventoService,
    private auth: AuthStateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.eventoService.miseventos().subscribe(
      (data: any) => {
        this.eventos = data;
        this.isLoading = false;
        console.log(this.eventos);
      },
      (error) => {
        this.errors = error.error.error;
        this.isLoading = false;
      }
    );
    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
      if (this.isSignedIn) {
        this.authService.profileUser().subscribe((data: any) => {
          this.user = data;
          //console.log(data);
        });
      }
    });
  }

  ngOnInit(): void {}

  verDetalles(id: number | undefined) {
    if (typeof id === 'number') {
      this.router.navigate(['/evento/view', id]);
    }
  }
}
