import {Status} from './enums';
import {User} from './user.interface';

export interface SubTask {
  id?: number;
  title: string;
  description?: string;
  status: Status;
  dueDate?: Date;
  assignee?: User;
  taskId: number;
}
