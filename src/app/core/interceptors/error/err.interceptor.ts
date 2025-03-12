import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errInterceptor: HttpInterceptorFn = (req, next) => {

  return next(req).pipe( catchError((err)=>{

    console.log("fromErrorInterceptor",err);
    return throwError(()=>{
      return err
    })
  }) );
};
