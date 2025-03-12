import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

    constructor(private httpClient:HttpClient) { }

    createComment(data:any):Observable <any>{
         return this.httpClient.post(`https://linked-posts.routemisr.com/comments`,data) 
         }
         getPostsComments(id:string):Observable <any>{
          return this.httpClient.get(`${environment.baseUrl}/posts/${id}/comments`) 
          }
          updateComment(id:string ,data:any):Observable <any>{
            return this.httpClient.put(`${environment.baseUrl}/comments/${id}`,data) 
            }
            deleteComment(id:string ):Observable <any>{
              return this.httpClient.delete(`${environment.baseUrl}/comments/${id}`) 
              }
  }