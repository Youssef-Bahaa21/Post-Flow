import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  signup(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/users/signup`, data);
  }

  signIn(data: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/users/signin`, data);
  }

  changePass(data: any): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}/users/change-password`, data);
  }

  updateProfilePhoto(data: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/users/upload-photo`, data);
  }

  getLoggedUserData(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/profile-data`);
  }


}
