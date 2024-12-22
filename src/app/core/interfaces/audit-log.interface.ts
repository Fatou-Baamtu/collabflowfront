import {ActionEnum, EntityEnum} from './enums';
import {UserInterface} from './user.interface';

export interface AuditLog {
  id?: number;
  entity: EntityEnum;
  action: ActionEnum;
  timestamp: Date;
  entityId: number;
  user?: UserInterface;
}
