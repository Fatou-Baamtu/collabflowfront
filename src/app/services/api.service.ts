import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api.response.interface';
import { HttpOptions } from '../interfaces/http-options.interface';
import {environment} from '../../environments/environment'; // Assurez-vous d'importer HttpOptions

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  protected defaultOptions: HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };
  constructor(private http: HttpClient) {}

  // Méthode GET
  public get<T>(endpoint: string, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.get<ApiResponse<T>>(
      fullUrl,
      { ...this.defaultOptions, ...options }
    ).pipe(
      tap(response => this.logResponse('GET', fullUrl, response))
    );
  }

  // Méthode POST
  public post<T>(
    endpoint: string,
    data: any,
    options?: HttpOptions,
    wrapResponse: boolean = true
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.post<any>(
      fullUrl,
      data,
      { ...this.defaultOptions, ...options }
    ).pipe(
      map(response => {
        if (wrapResponse) {
          return {
            success: true,
            data: response,
            status: 200
          };
        }
        return response;
      }),
      tap(response => this.logResponse('POST', fullUrl, response))
    );
  }

  // Méthode PUT
  public put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(
      fullUrl,
      data,
      { ...this.defaultOptions, ...options }
    ).pipe(
      tap(response => this.logResponse('PUT', fullUrl, response))
    );
  }

  // Méthode DELETE
  public delete<T>(endpoint: string, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(
      fullUrl,
      { ...this.defaultOptions, ...options }
    ).pipe(
      tap(response => this.logResponse('DELETE', fullUrl, response))
    );
  }

  // Méthode PATCH ajoutée
  public patch<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.patch<ApiResponse<T>>(
      fullUrl,
      data,
      { ...this.defaultOptions, ...options }
    ).pipe(
      tap(response => this.logResponse('PATCH', fullUrl, response))
    );
  }

  // Méthode pour loguer les réponses
  private logResponse(method: string, url: string, response: any) {
    if (!environment.production) {
      console.log(`${method} request to ${url} was successful:`, response);
    }
  }
}
