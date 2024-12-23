import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Task} from '../../core/interfaces/task.interface';
import {Status} from '../../core/interfaces/enums';
import {TaskDetailDialogComponent} from './task-detail-dialog.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, TaskDetailDialogComponent],
  template: `
    <div class="task-card bg-white p-3 rounded shadow-sm mb-2 cursor-pointer hover:bg-gray-50"
         (click)="openTaskDetail()">
<!--      <div class="flex justify-between items-start">-->
<!--        <h3 class="text-sm font-medium text-gray-900">{{task.title}}</h3>-->
<!--        @if (task.priority === 'URGENT') {-->
<!--          <span class="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Urgent</span>-->
<!--        }-->
<!--      </div>-->
      @if (task.description) {
        <p class="text-sm text-gray-600 mt-1">{{task.description}}</p>
      }
      <div class="mt-2 flex items-center justify-between">
        @if (task.dueDate) {
          <span class="text-xs text-gray-500">
            Échéance: {{task.dueDate | date:'shortDate'}}
          </span>
        }
        @if (task.assignee) {
          <div class="flex items-center">
            <span class="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
              {{task.assignee.firstName?.charAt(0)}}
            </span>
          </div>
        }
      </div>
      @if (task.subTasks && task.subTasks.length > 0) {
        <div class="mt-2 text-xs text-gray-600">
          <span>{{getCompletedSubtasks()}}/{{task.subTasks.length}} sous-tâches</span>
        </div>
      }
    </div>
    <app-task-detail-dialog #taskDetailDialog></app-task-detail-dialog>

  `
})
export class TaskCardComponent {
  @Input() task!: Task;
  @ViewChild('taskDetailDialog') taskDetailDialog!: TaskDetailDialogComponent;
  @Output() taskUpdated = new EventEmitter<void>();

  getCompletedSubtasks(): number {
    return this.task.subTasks?.filter(st => st.status === Status.DONE).length || 0;
  }

  openTaskDetail() {
    console.log('la tache cliquer' + this.task.id)
    this.taskDetailDialog.open(this.task.id);
    this.taskDetailDialog.afterClosed.subscribe(saved => {
      if (saved) {
        this.taskUpdated.emit();
      }
    });
  }
}
