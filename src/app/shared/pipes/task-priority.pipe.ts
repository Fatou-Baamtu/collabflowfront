import { Pipe, PipeTransform } from '@angular/core';
import {Priority} from '../../core/interfaces/enums';

@Pipe({
  name: 'taskPriority',
  standalone: true
})
export class TaskPriorityPipe implements PipeTransform {
  transform(priority: Priority): string {
    const priorityMap: { [key in Priority]: string } = {
      [Priority.URGENT]: 'Urgente',
      [Priority.NORMAL]: 'Normale',
      [Priority.LOW]: 'Basse'
    };
    return priorityMap[priority] || 'Non définie';
  }
}
