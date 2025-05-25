import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from '../../../shared/token.service';
import { CategoriaService } from '../categoria.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class CreateCategoriaComponent {
  categoriaForm!: FormGroup;
  errors: any = null;
  isSignedIn!: boolean;

  constructor(
    public router: Router,
    public categoriaService: CategoriaService,
    public token: TokenService
  ) {}

  ngOnInit(): void {
    this.categoriaForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
    });
    this.isSignedIn = this.token.isLoggedIn();
  }

  onSubmit() {
    if (this.categoriaForm.valid) {
      this.categoriaService.create(this.categoriaForm.value).subscribe(
        (result: any) => {
          console.log('Categoría creada exitosamente:', result);
          this.categoriaForm.reset();
          this.router.navigate(['admin/categorias']);
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al crear categoría:', error);
        }
      );
    }
  }
}
