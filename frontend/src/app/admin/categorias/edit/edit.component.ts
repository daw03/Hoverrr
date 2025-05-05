import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from '../../../shared/token.service';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../categoria';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
})
export class EditCategoriaComponent implements OnInit {
  categoriaForm!: FormGroup;
  errors: any = null;
  categoriaId!: number;
  isSignedIn!: boolean;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    public token: TokenService
  ) {}

  ngOnInit(): void {
    this.categoriaForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
    });
    this.isSignedIn = this.token.isLoggedIn();

    // Obtiene el ID de la categoría de la URL
    this.route.params.subscribe(params => {
      this.categoriaId = +params['id'];
      this.loadCategoria();
    });
  }

  loadCategoria() {
    this.categoriaService.show(this.categoriaId).subscribe(
      (result: Categoria) => {
        this.categoriaForm.patchValue({
          nombre: result.nombre,
        });
      },
      (error: HttpErrorResponse) => {
        this.errors = error.error;
        console.error('Error al cargar la categoría:', error);
        //this.router.navigate(['/categorias/index']);
      }
    );
  }

  onSubmit() {
    if (this.categoriaForm.valid) {
      this.categoriaService.update(this.categoriaId, this.categoriaForm.value).subscribe(
        (result: any) => {
          console.log('Categoría actualizada exitosamente:', result);
          //this.router.navigate(['/categorias/index']);
        },
        (error: HttpErrorResponse) => {
          this.errors = error.error;
          console.error('Error al actualizar la categoría:', error);
        }
      );
    }
  }
}
