import {inject, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api.response.interface';
import {Comment} from '../interfaces/comment.interface';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private api = inject(ApiService);
  private endpoint = '/api/comments';

  getAll(taskId: number): Observable<ApiResponse<Comment[]>> {
    return this.api.get<Comment[]>(`${this.endpoint}?taskId=${taskId}`);
  }

  create(comment: Comment): Observable<ApiResponse<Comment>> {
    return this.api.post<Comment>(this.endpoint, comment);
  }

  update(comment: Comment): Observable<ApiResponse<Comment>> {
    return this.api.put<Comment>(`${this.endpoint}/${comment.id}`, comment);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
