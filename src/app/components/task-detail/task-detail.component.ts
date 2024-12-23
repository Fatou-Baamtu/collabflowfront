import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubtaskListComponent} from './subtask-list.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Status , Priority} from '../../core/interfaces/enums';
import {TaskService} from '../../core/services/task.service';
import {CommentSectionComponent} from '../comment/comment-section.component';
import {Task} from '../../core/interfaces/task.interface';
import {ToastService} from '../../core/services/toast.service';
import {CustomInputComponent} from '../../shared/components/ui/custom/custom-input.component';
import {CustomButtonComponent} from '../../shared/components/ui/custom/custom-button.component';


@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, SubtaskListComponent, CommentSectionComponent, FormsModule, ReactiveFormsModule, CustomInputComponent, CustomButtonComponent],
  template: `
    <div class="task-detail p-4">
      <form [formGroup]="taskForm" class="space-y-4">
        <app-custom-input
          label="Titre"
          id="title"
          formControlName="title"
          [required]="true"
          placeholder="Entrez le titre de la tâche"
        ></app-custom-input>

        <app-custom-input
          label="Description"
          id="description"
          formControlName="description"
          placeholder="Entrez la description de la tâche"
          type="textarea"
        ></app-custom-input>

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
        </div>

        <app-subtask-list [taskId]="taskId"></app-subtask-list>
        <app-comment-section [taskId]="taskId"></app-comment-section>

        <div class="flex justify-end gap-2">
          <app-custom-button type="button" (onClick)="cancel()">
            Annuler
          </app-custom-button>
          <app-custom-button
            type="submit"
            (onClick)="save()"
            [disabled]="!taskForm.valid"
          >
            Enregistrer
          </app-custom-button>
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
    console.log('dans les detail !!!!!' + this.taskId)
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
