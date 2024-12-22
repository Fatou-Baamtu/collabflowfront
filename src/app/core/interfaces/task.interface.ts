import {Status} from './enums';
import {User} from './user.interface';
import {SubTask} from './subtask.interface';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: Status;
  dueDate?: Date;
  isCompleted: boolean;
  assignee?: User;
  subTasks?: SubTask[];
  comments?: Comment[];
}
