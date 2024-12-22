export interface User {
  id: number;
  login: string;
  firstName?: string;
  lastName?: string;
  email: string;
  activated?: boolean;
  langKey?: string;
  authorities?: string[];
  createdBy?: string;
  createdDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}
