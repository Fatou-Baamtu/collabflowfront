import {User} from './user.interface';

export interface ProjectMember {
  id: number;
  projectId: number;
  user: User;
  role: string;
  joinedAt: Date;
}
