import {inject, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api.response.interface';
import {SubTask} from '../interfaces/subtask.interface';
import {Status} from '../interfaces/enums';

@Injectable({
  providedIn: 'root'
})
export class SubTaskService {
  private api = inject(ApiService);
  private endpoint = '/api/subtasks';

  getAll(taskId: number): Observable<ApiResponse<SubTask[]>> {
    return this.api.get<SubTask[]>(`${this.endpoint}?taskId=${taskId}`);
  }

  create(subtask: SubTask): Observable<ApiResponse<SubTask>> {
    return this.api.post<SubTask>(this.endpoint, subtask);
  }

  update(subtask: SubTask): Observable<ApiResponse<SubTask>> {
    return this.api.put<SubTask>(`${this.endpoint}/${subtask.id}`, subtask);
  }

  updateStatus(id: number, status: Status): Observable<ApiResponse<SubTask>> {
    return this.api.patch<SubTask>(`${this.endpoint}/${id}/status`, { status });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
