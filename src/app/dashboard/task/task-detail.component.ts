import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubtaskListComponent} from './subtask-list.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Status , Priority} from '../../core/interfaces/enums';
import {TaskService} from '../../core/services/task.service';
import {CommentSectionComponent} from '../comment/comment-section.component';
import {Task} from '../../core/interfaces/task.interface';
import {ToastService} from '../../core/services/toast.service';


@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, SubtaskListComponent, CommentSectionComponent, FormsModule, ReactiveFormsModule],
  template: `
    <div class="task-detail p-4">
      <form [formGroup]="taskForm" class="space-y-4">
        <div>
          <input
            type="text"
            formControlName="title"
            class="w-full text-xl font-semibold p-2 border-b focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              formControlName="description"
              rows="3"
              class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div class="flex gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              formControlName="status"
              class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option [value]="Status.TODO">À faire</option>
              <option [value]="Status.IN_PROGRESS">En cours</option>
              <option [value]="Status.DONE">Terminé</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Priorité</label>
            <select
              formControlName="priority"
              class="mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option [value]="Priority.LOW">Basse</option>
              <option [value]="Priority.NORMAL">Normale</option>
              <option [value]="Priority.URGENT">Urgente</option>
            </select>
          </div>
        </div>

        <app-subtask-list [taskId]="taskId"></app-subtask-list>
        <app-comment-section [taskId]="taskId"></app-comment-section>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            (click)="cancel()"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            (click)="save()"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  `
})
export class TaskDetailComponent {
  toastService = inject(ToastService);

  @Input() taskId!: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();


  Status = Status;
  Priority = Priority;

  taskForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl(''),
    status: new FormControl<Status>(Status.TODO, { nonNullable: true }),
    priority: new FormControl<Priority>(Priority.NORMAL, { nonNullable: true }),
    dueDate: new FormControl<Date | null>(null)
  });

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    if (this.taskId) {
      this.taskService.getById(this.taskId).subscribe(response => {
        if (response.success) {
          this.taskForm.patchValue(response.data);
        }
      });
    }
  }

  save() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;

      const taskData: Task = {
        title: formValue.title!,
        status: formValue.status!,
        isCompleted: false,
        description: formValue.description || undefined,
        dueDate: formValue.dueDate || undefined
      };

      if (this.taskId) {
        taskData.id = this.taskId;
      }

      const observable = this.taskId
        ? this.taskService.update(taskData)
        : this.taskService.create(taskData);

      observable.subscribe({
        next: (response) => {
          if (response.success) {
            // Afficher un toast de succès
            this.toastService.success(
              this.taskId ? 'Tâche mise à jour avec succès' : 'Tâche créée avec succès'
            );
            this.saved.emit();
          }
        },
        error: (error) => {
          this.toastService.error('Une erreur est survenue');
        }
      });
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
