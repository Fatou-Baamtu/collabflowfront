import {Project} from './project.interface';
import {SubTask} from './subtask.interface';
import {Comment} from './comment.interface';

export enum Priority {
  URGENT = 'URGENT',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum EntityEnum {
  Project = 'Project',
  Task = 'Task',
  SubTask = 'SubTask',
  Comment = 'Comment'
}

export enum ActionEnum {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED'
}
