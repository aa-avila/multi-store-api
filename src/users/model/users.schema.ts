import { BaseDoc } from '../../common/types/baseDoc.schema';
import { Role } from '../../common/enums/role.enum';
import { ID } from '../../common/types/id';

export type UserSchema = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: Role[];
  password?: string;
  token?: string;
  companyId?: ID;
};

export type UserDoc = UserSchema & BaseDoc;
