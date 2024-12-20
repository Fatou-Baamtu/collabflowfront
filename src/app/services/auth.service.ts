import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ApiResponse, AuthResponse} from '../interfaces/api.response.interface'; // Assurez-vous que l'interface ApiResponse est bien importée

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  login(username: string, password: string, rememberMe: boolean): Observable<ApiResponse<AuthResponse>> {
    const uri = '/authenticate';
    const body = { username, password, rememberMe };

    return this.apiService.post<AuthResponse>(uri, body).pipe(
      map((response) => {
        console.log('pourquoi ça n\'entre pas ici ???? ')
        console.log(response)
        if (response.success && response.data?.id_token) {
          localStorage.setItem('token', response.data.id_token); // Stocke le token dans le localStorage
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
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
