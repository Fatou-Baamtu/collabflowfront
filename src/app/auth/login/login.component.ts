import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    NgIf
  ]
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password, this.rememberMe).subscribe({
      next: (response) => {
        console.log(response)
        // Redirection après succès
        if (response.success) {
          console.log('et pourquoi tu navigue pas ??')

          this.router.navigate(['dashboard']);
        }
      },
      error: (err) => {
        // Le message d'erreur provient de l'interceptor
        this.errorMessage = err.message || 'Connexion échouée.';
      }
    });
  }

}
