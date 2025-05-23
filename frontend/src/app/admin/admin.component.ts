import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true,
  imports: [RouterModule],
})
export class AdminComponent implements OnInit {
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.comprobarADmin();
  }

  private comprobarADmin() {
    this.authService
      .profileUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          if (data.role_id != '2') {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.router.navigate(['/']);
        },
      });
  }
}
