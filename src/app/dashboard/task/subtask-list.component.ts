// subtask-list.component.ts
import {Component, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Status} from '../../core/interfaces/enums';
import {SubTask} from '../../core/interfaces/subtask.interface';
import {SubTaskService} from '../../core/services/subtask.service';

@Component({
  selector: 'app-subtask-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="subtasks-section mt-4">
      <h3 class="text-lg font-medium text-gray-900">Sous-tâches</h3>
      <div class="mt-2 space-y-2">
        @for (subtask of subtasks(); track subtask.id) {
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              [checked]="subtask.status === Status.DONE"
              (change)="toggleSubtask(subtask)"
              class="rounded text-blue-600"
            />
            <span [class.line-through]="subtask.status === Status.DONE">
              {{subtask.title}}
            </span>
          </div>
        }

        <!-- New subtask input -->
        <div class="flex items-center gap-2 mt-2">
          <input
            type="text"
            [(ngModel)]="newSubtaskTitle"
            (keyup.enter)="addSubtask()"
            placeholder="Ajouter une sous-tâche"
            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            (click)="addSubtask()"
            class="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `
})
export class SubtaskListComponent {
  @Input() taskId!: number;
  Status = Status;
  subtasks = signal<SubTask[]>([]);
  newSubtaskTitle = '';

  constructor(private subtaskService: SubTaskService) {}

  ngOnInit() {
    this.loadSubtasks();
  }

  loadSubtasks() {
    this.subtaskService.getAll(1).subscribe(response => {
      if (response.success) {
        this.subtasks.set(response.data);
      }
    });
  }

  toggleSubtask(subtask: SubTask) {
    const newStatus = subtask.status === Status.DONE ? Status.TODO : Status.DONE;
    this.subtaskService.updateStatus(subtask.id!, newStatus).subscribe(response => {
      if (response.success) {
        this.loadSubtasks();
      }
    });
  }

  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      const newSubtask: SubTask = {
        title: this.newSubtaskTitle,
        status: Status.TODO,
        taskId: this.taskId
      };

      this.subtaskService.create(newSubtask).subscribe(response => {
        if (response.success) {
          this.newSubtaskTitle = '';
          this.loadSubtasks();
        }
      });
    }
  }
}
