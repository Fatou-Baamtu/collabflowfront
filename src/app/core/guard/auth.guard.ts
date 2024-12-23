import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';

export const authGuard = () => {
  const router = inject(Router);
  const userService = inject(AuthService);

  return userService.currentUser$.pipe(
    map(user => {
      if (user) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};
