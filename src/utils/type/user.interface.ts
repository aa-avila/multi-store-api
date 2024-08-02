import { Role } from '../enum/role';

export type UserType = {
  _id: string;

  email: string;

  identificationNumber: number;

  identificationChar: string;

  roles: Role[];
};
