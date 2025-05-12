import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { TokenService } from './shared/token.service';
import { AuthService } from './shared/auth.service';
import { AuthStateService } from './shared/auth-state.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

export class User {
  id!: number;
  name!: string;
  email!: string;
  role_id!: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
})
export class AppComponent implements OnInit, OnDestroy {
  isSignedIn!: boolean;
  user: User = new User();
  private destroy$ = new Subject<void>();

  constructor(
    private authState: AuthStateService,
    public router: Router,
    public token: TokenService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authState.userAuthState
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.isSignedIn = val;
      });

    this.checkAuthAndLoadUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAuthAndLoadUser() {
    if (this.token.isLoggedIn()) {
      this.authState.setAuthState(true);
      this.getUserLoggedIn();
    }
  }

  signOut() {
    this.authState.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['']);
    console.log('Sesion cerrada');
  }

  private getUserLoggedIn() {
    this.authService.profileUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.user = data;
          //console.log(this.user); // Usuario
        },
        error: (error) => {
          console.error('Error al cargar el perfil del usuario', error);
          this.authState.setAuthState(false);
          this.token.removeToken();
          //this.router.navigate(['/login']);
        }
      });
  }
}