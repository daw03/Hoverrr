import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../shared/auth.service';
import { CommonModule } from '@angular/common';

// Interfaz del usuario
export class User {
  name: any;
  email: any;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [CommonModule],
})
export class UserProfileComponent implements OnInit {
  UserProfile!: User; 

  constructor(public authService: AuthService) {
    
    this.authService.profileUser().subscribe((data: any) => {
      this.UserProfile = data;  // Asignar los datos recibidos a la variable UserProfile
    });
  }

  ngOnInit() {}
}
