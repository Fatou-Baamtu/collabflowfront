import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, of} from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { User } from '../interfaces/user.interface';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import {ApiResponse} from '../interfaces/api.response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = '/api/admin/users';
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    if (this.authService.isAuthenticated()) {
      this.loadCurrentUser().subscribe();
    }
  }

  loadCurrentUser(): Observable<User | null> {
    return this.apiService.get<string>('/authenticate').pipe(
      switchMap((response: ApiResponse<string>) => {
        if (response.success && response.data) {
          return this.getUserByLogin(response.data); // Retourne Observable<User>
        }
        return of(null); // Retourne Observable<null>
      }),
      tap(user => this.currentUserSubject.next(user))
    );
  }


  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  getUserByLogin(login: string): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/${login}`).pipe(
      map(response => response.data)
    );
  }

// Récupérer un utilisateur par ID
  getUserById(userId: string): Observable<ApiResponse<User>> {
    return this.apiService.get<User>(`${this.endpoint}/${userId}`);
  }

  // Créer un nouvel utilisateur
  createUser(user: Partial<User>): Observable<ApiResponse<User>> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  // Mettre à jour un utilisateur
  updateUser(userId: string, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.apiService.put<User>(`${this.endpoint}/${userId}`, user);
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): Observable<ApiResponse<null>> {
    return this.apiService.delete<null>(`${this.endpoint}/${userId}`);
  }

  // Lister les utilisateurs
  listUsers(): Observable<ApiResponse<User[]>> {
    return this.apiService.get<User[]>(this.endpoint);
  }
}
