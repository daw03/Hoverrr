import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router'; // Importa RouterModule
import { TokenService } from './shared/token.service';
import { AuthStateService } from './shared/auth-state.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Añade RouterModule a las imports
})
export class AppComponent implements OnInit {
  title = 'Hoverrr';
  isSignedIn!: boolean;

  constructor(
    private auth: AuthStateService,
    public router: Router,
    public token: TokenService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.auth.userAuthState.subscribe((val) => {
      this.isSignedIn = val;
    });
    this.titleService.setTitle(this.title);
  }

  // Signout logic
  signOut() {
    this.auth.setAuthState(false);
    this.token.removeToken();
    this.router.navigate(['']);
    console.log('User signed out successfully!');
  }
}