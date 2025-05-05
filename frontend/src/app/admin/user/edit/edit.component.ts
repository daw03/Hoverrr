import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class EditUserComponent implements OnInit {
  userForm!: FormGroup;
  errors: any = null;
  userId!: number;
  isSignedIn!: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role_id: new FormControl('', [Validators.required]),
    });
    this.isSignedIn = true;

    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.loadUser();
    });
  }

  loadUser() {
    this.userService.show(this.userId).subscribe(
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
        this.router.navigate(['/user/index']);
      }
    );
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value;
      this.userService.update(this.userId, updatedUser).subscribe(
        (result: User) => {
          console.log('Usuario actualizado:', result);
          this.router.navigate(['/user/index']);
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al actualizar usuario:', error);
        }
      );
    }
  }
}
