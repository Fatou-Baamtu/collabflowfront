import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuration du routage
    provideRouter(routes),
    provideAnimations(),

    // Configuration du client HTTP avec intercepteurs via DI
    provideHttpClient(
      withInterceptorsFromDi() // Inclut les intercepteurs fournis via DI
    ),

    // // Ajout d'autres services et valeurs
    // { provide: 'API_URL', useValue: environment.apiUrl },

    // Déclaration manuelle des intercepteurs via `multi: true` si nécessaire
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ]
};
