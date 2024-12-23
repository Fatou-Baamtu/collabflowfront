import { Pipe, PipeTransform } from '@angular/core';
import {Status} from '../../core/interfaces/enums';

@Pipe({
  name: 'taskStatus',
  standalone: true
})
export class TaskStatusPipe implements PipeTransform {
  transform(status: Status): string {
    const statusMap: { [key in Status]: string } = {
      [Status.TODO]: 'À faire',
      [Status.IN_PROGRESS]: 'En cours',
      [Status.DONE]: 'Terminée'
    };
    return statusMap[status] || status;
  }
}
