import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  login(): void {
    this.apiService.validateLogin(this.email, this.password).subscribe({
      next: (isValid: boolean) => {
        if (isValid) {
          this.router.navigate(['/dashboard']); // Redirige al dashboard
        } else {
          alert('Correo o contraseña incorrectos'); // Credenciales no válidas
        }
      },
      error: () => {
        alert('Error al comunicarse con el servidor. Inténtalo de nuevo más tarde.');
      },
    });
  }
}
