import { Role } from '../../common/enums/role.enum';

export interface ICreateUser {
  email: string;
  firstName: string;
  lastName: string;
  roles?: Role[];
}
