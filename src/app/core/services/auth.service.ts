import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ApiResponse} from '../interfaces/api.response.interface';
import {AuthRequest, AuthResponse} from '../interfaces/auth.interface';
import {UserService} from './user.service'; // Assurez-vous que l'interface ApiResponse est bien importée

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService , private userService: UserService) {}

  login(authRequest: AuthRequest): Observable<ApiResponse<AuthResponse>> {
    const uri = '/authenticate';

    // On envoie l'objet authRequest qui contient username, password et rememberMe
    return this.apiService.post<AuthResponse>(uri, authRequest).pipe(
      map((response) => {
        if (response.success && response.data?.id_token) {
          localStorage.setItem('token', response.data.id_token); // Stocke le token dans le localStorage
          // Charger l'utilisateur après le login
          this.userService.loadCurrentUser().subscribe();

        }
        return response;
      })
    );

  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userService.currentUserSubject.next(null); // Réinitialiser l'utilisateur courant

  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
