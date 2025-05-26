import { Component, OnInit } from '@angular/core';
import { User } from '../../admin/user/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/auth.service';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class UserProfileEditComponent {
  private apiUrl = 'http://98.66.153.140/api/api/users';
  userForm!: FormGroup;
  errors: any = null;
  isSignedIn!: boolean;
  UserProfile!: User; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  update(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  show(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role_id: new FormControl('', [Validators.required]),
    });
    this.isSignedIn = true;

    this.authService.profileUser().subscribe((data: any) => {
      this.UserProfile = data;
      this.loadUser();
    });
  }

  loadUser() {
    this.show(this.UserProfile.id).subscribe(
      (user: User) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role_id: user.role_id,
        });
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar usuario:', error);
        this.router.navigate(['/profile']);
      }
    );
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      this.update(this.UserProfile.id, updatedUser).subscribe(
        (result: User) => {
          console.log('Usuario actualizado:', result);
          this.router.navigate(['/profile']);
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al actualizar usuario:', error);
        }
      );
    }
  }
}
