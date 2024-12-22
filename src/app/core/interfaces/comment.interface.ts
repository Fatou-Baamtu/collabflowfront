import {User} from './user.interface';

export interface Comment {
  id?: number;
  content: string;
  createdAt: Date;
  taskId: number;
  user?: User;
}
