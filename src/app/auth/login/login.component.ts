import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {CustomInputComponent} from '../../shared/components/ui/custom/custom-input.component';
import {CustomCheckboxComponent} from '../../shared/components/ui/custom/custom-checkbox.component';
import {CustomButtonComponent} from '../../shared/components/ui/custom/custom-button.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    CustomInputComponent,
    CustomCheckboxComponent,
    CustomButtonComponent,

  ]
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const authRequest = {
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    };
    this.authService.login(authRequest).subscribe({
      next: (response) => {
        console.log(response)
        // Redirection après succès
        if (response.success) {
          // Réinitialiser le formulaire (les champs et la validité)
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
