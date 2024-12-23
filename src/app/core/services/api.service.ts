import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api.response.interface';
import { HttpOptions } from '../interfaces/http-options.interface';
import { environment } from '../../../environments/environment';

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

  // Méthode pour formater la réponse de manière uniforme
  private formatResponse<T>(response: any, wrapResponse: boolean = true): ApiResponse<T> {
    console.log('la reponse' + response );
    if (wrapResponse) {
      return {
        success: true,
        data: response,
        status: 200
      };
    }
    return response;
  }

  // Méthode GET
  public get<T>(
    endpoint: string,
    options?: HttpOptions,
    wrapResponse: boolean = true
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.get<any>(
      fullUrl,
      { ...this.defaultOptions, ...options }
    ).pipe(
      map(response => this.formatResponse<T>(response, wrapResponse)),
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
      map(response => this.formatResponse<T>(response, wrapResponse)),
      tap(response => this.logResponse('POST', fullUrl, response))
    );
  }

  // Méthode PUT
  public put<T>(
    endpoint: string,
    data: any,
    options?: HttpOptions,
    wrapResponse: boolean = true
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.put<any>(
      fullUrl,
      data,
      { ...this.defaultOptions, ...options }
    ).pipe(
      map(response => this.formatResponse<T>(response, wrapResponse)),
      tap(response => this.logResponse('PUT', fullUrl, response))
    );
  }

  // Méthode DELETE
  public delete<T>(
    endpoint: string,
    options?: HttpOptions,
    wrapResponse: boolean = true
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.delete<any>(
      fullUrl,
      { ...this.defaultOptions, ...options }
    ).pipe(
      map(response => this.formatResponse<T>(response, wrapResponse)),
      tap(response => this.logResponse('DELETE', fullUrl, response))
    );
  }

  // Méthode PATCH
  public patch<T>(
    endpoint: string,
    data: any,
    options?: HttpOptions,
    wrapResponse: boolean = true
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.patch<any>(
      fullUrl,
      data,
      { ...this.defaultOptions, ...options }
    ).pipe(
      map(response => this.formatResponse<T>(response, wrapResponse)),
      tap(response => this.logResponse('PATCH', fullUrl, response))
    );
  }

  // Méthode pour loguer les réponses
  private logResponse(method: string, url: string, response: any) {
    if (!environment.production) {
      console.log(`${method} request to ${url} was successful:`, response);
    }
  }
  public getText(endpoint: string, options?: HttpOptions): Observable<string> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const textOptions = {
      ...this.defaultOptions,
      ...options,
      responseType: 'text' as 'text'  // Forcer le type de réponse en texte
    };

    return this.http.get(fullUrl, textOptions).pipe(
      tap(response => this.logResponse('GET', fullUrl, response))
    );
  }
}
