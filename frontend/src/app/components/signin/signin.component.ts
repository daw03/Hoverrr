import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { TokenService } from '../../shared/token.service';
import { AuthStateService } from '../../shared/auth-state.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule], 
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup;
  errors: any = null;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService
  ) {
    // Inicializar el formulario con los campos email y password
    this.loginForm = this.fb.group({
      email: [],
      password: [],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    // Enviar los datos del formulario al servicio de autenticación
    this.authService.signin(this.loginForm.value).subscribe(
      (result) => {
        this.responseHandler(result);  // Manejar la respuesta cuando el inicio de sesión sea exitoso
      },
      (error) => {
        this.errors = error.error;  // Mostrar los errores en caso de fallo
      },
      () => {
        this.authState.setAuthState(true);  // Cambiar el estado de autenticación
        this.loginForm.reset();  // Resetear el formulario
        this.router.navigate(['profile']);  // Redirigir al perfil del usuario
      }
    );
  }

  // Manejar la respuesta del servidor
  responseHandler(data: any): void {
    this.token.handleData(data.access_token);  // Almacenar el token de acceso
  }
}
