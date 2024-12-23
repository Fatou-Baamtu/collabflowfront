import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {ApiResponse} from '../interfaces/api.response.interface';
import {AuthRequest, AuthResponse} from '../interfaces/auth.interface';
import {UserService} from './user.service';
import {User} from '../interfaces/user.interface';
import {TokenService} from './TokenService'; // Assurez-vous que l'interface ApiResponse est bien importée

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private userService: UserService,
  private tokenService: TokenService

) {
    if (this.isAuthenticated()) {
      this.loadCurrentUser().subscribe();
    }
  }

  login(authRequest: AuthRequest): Observable<ApiResponse<AuthResponse>> {
    const uri = '/authenticate';

    return this.apiService.post<AuthResponse>(uri, authRequest).pipe(
      map((response) => {
        if (response.success && response.data?.id_token) {
          this.tokenService.setToken(response.data.id_token);
          // Charger l'utilisateur après le login
          this.loadCurrentUser().subscribe();
        }
        return response;
      })
    );
  }

  loadCurrentUser(): Observable<User | null> {
    return this.apiService.getText('/authenticate').pipe(
      switchMap(login => {
        if (login) {
          return this.userService.getUserByLogin(login);
        }
        return of(null);
      }),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }



  logout(): void {
    localStorage.removeItem('token');

  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }
}

