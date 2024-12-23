import {Priority} from './enums';
import {Task} from './task.interface';
import {User} from './user.interface';

export interface Project {
  id?: number;
  name: string;
  description?: string;
  priority: Priority;
  startDate?: Date;
  endDate?: Date;
  tasks?: Task[];
}

