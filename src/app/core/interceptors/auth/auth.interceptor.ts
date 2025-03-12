import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const pLATFORM_ID = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  if (isPlatformBrowser(pLATFORM_ID)) {
    const token = authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          token: token
        }
      });
    }
  }

  return next(req);
};


  
