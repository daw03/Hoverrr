import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditUserComponent implements OnInit {
  private apiUrl = 'http://127.0.0.1:8000/api/users';
  userForm!: FormGroup;
  errors: any = null;
  isSignedIn!: boolean;
  UserProfile!: User; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role_id: new FormControl('', [Validators.required]),
    });
    this.isSignedIn = true;

    const idRuta = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.show(idRuta).subscribe((data: any) => {
      this.UserProfile = data;
      this.loadUser();
    });
  }

  loadUser() {
    this.userService.show(this.UserProfile.id).subscribe(
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
        this.router.navigate(['/admin/users']);
      }
    );
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      this.userService.update(this.UserProfile.id, updatedUser).subscribe(
        (result: User) => {
          console.log('Usuario actualizado:', result);
          this.router.navigate(['/admin/users']);
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al actualizar usuario:', error);
        }
      );
    }
  }
}
