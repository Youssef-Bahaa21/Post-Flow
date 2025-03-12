import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private httpClient: HttpClient) { }

  createPost(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts`, data);
  }

  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts`);
  }
      
  getMyPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/664bcf3e33da217c4af21f00/posts`);
  }
  
  getSinglePost(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${id}`);
  }

  updatePost(data: object, id: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${id}`, data);
  }
         
  deletePost(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/posts/${id}`);
  }
}
