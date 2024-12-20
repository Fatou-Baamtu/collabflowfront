import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error?.detail) {
          errorMessage = error.error.detail;
        } else if (error.status === 0) {
          errorMessage = 'Network error: Unable to connect to the server.';
        } else if (error.status >= 400 && error.status < 500) {
          errorMessage = `Client error: ${error.message}`;  // Correction ici
        } else if (error.status >= 500) {
          errorMessage = `Server error: ${error.message}`;  // Correction ici
        }

        console.error(`HTTP Error: ${errorMessage}`, error);  // Correction ici

        // Optionnel : Afficher un message d'erreur à l'utilisateur
       // alert(errorMessage);

        return throwError(() => new Error(errorMessage)); // Propager l'erreur
      })
    );
  }
}
