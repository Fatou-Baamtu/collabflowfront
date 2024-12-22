import {inject, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {Observable} from 'rxjs';
import {ApiResponse} from '../interfaces/api.response.interface';
import {Task} from '../interfaces/task.interface';
import {Priority, Status} from '../interfaces/enums';
import {FormControl, ɵValue} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private api = inject(ApiService);
  private endpoint = '/api/tasks';

  getAll(projectId: number): Observable<ApiResponse<Task[]>> {
    return this.api.get<Task[]>(`${this.endpoint}?projectId=${projectId}`);
  }

  getById(id: number): Observable<ApiResponse<Task>> {
    return this.api.get<Task>(`${this.endpoint}/${id}`);
  }

  create(task: Task): Observable<ApiResponse<Task>> {
    return this.api.post<Task>(this.endpoint, task);
  }

  update(task: Task): Observable<ApiResponse<Task>> {
    return this.api.put<Task>(`${this.endpoint}/${task.id}`, task);
  }


  updateStatus(id: number, status: Status): Observable<ApiResponse<Task>> {
    return this.api.patch<Task>(`${this.endpoint}/${id}/status`, { status });
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  assignTask(taskId: number, userId: number): Observable<ApiResponse<Task>> {
    return this.api.put<Task>(`${this.endpoint}/${taskId}/assign/${userId}`, {});
  }
}
