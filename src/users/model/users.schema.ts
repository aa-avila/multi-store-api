import { BaseDoc } from '../../common/types/baseDoc.schema';
import { Role } from '../../common/enums/role.enum';

export type UserSchema = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: Role[];
  password?: string;
  token?: string;
};

export type UserDoc = UserSchema & BaseDoc;
