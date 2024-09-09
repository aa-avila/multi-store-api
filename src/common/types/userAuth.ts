import { ID } from './id';
import { Role } from '../enums/role.enum';

export type UserAuth = {
  userId: ID;
  email: string;
  companyId: ID;
  roles: Role[];
};
