import {Component, OnInit, signal} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';

import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task/task-card.component';
import { Task } from '../core/interfaces/task.interface';
import { Status } from '../core/interfaces/enums';
import { TaskService } from '../core/services/task.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TaskCardComponent, DragDropModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  todoTasks = signal<Task[]>([]);
  inProgressTasks = signal<Task[]>([]);
  doneTasks = signal<Task[]>([]);
  projectId: number | null = null;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = +params['projectId']; // Le + convertit la chaîne en nombre
      this.loadTasks();
    });
  }

  loadTasks() {
    if (this.projectId) {
      this.taskService.getAll(this.projectId).subscribe(response => {
        if (response.success) {
          const tasks = response.data;
          this.todoTasks.set(tasks.filter(task => task.status === Status.TODO));
          this.inProgressTasks.set(tasks.filter(task => task.status === Status.IN_PROGRESS));
          this.doneTasks.set(tasks.filter(task => task.status === Status.DONE));
        }
      });
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Mettre à jour le statut de la tâche
      const task = event.container.data[event.currentIndex];
      let newStatus: Status;

      switch (event.container.id) {
        case 'todoList':
          newStatus = Status.TODO;
          break;
        case 'progressList':
          newStatus = Status.IN_PROGRESS;
          break;
        case 'doneList':
          newStatus = Status.DONE;
          break;
        default:
          return;
      }

      task.status = newStatus;
      this.taskService.updateStatus(task.id!, newStatus).subscribe();
    }
  }

}





