import { Role } from '../../common/enums/role.enum';
import { CreateUserRequestDto } from '../dto/createUserRequest.dto';
import { ICreateUser } from '../interfaces/ICreateUser';

export const userCreateData: ICreateUser = {
  email: 'test@example.com',
  firstName: 'Pepito',
  lastName: 'Perez',
  phoneNumber: '1234567890',
  roles: [Role.SUPER_ADMIN],
};

export const userUpdateData: Partial<ICreateUser> = {
  firstName: 'New Name',
};

export const userId = '66dbb69cba5e9e58ead25baa';
export const companyId = '61d4c1b0bb013bc318c951d7';

export const userCreateReq: CreateUserRequestDto = {
  ...userCreateData,
};
