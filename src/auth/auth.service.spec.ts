import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';
import { Bcrypt } from '../common/bcrypt/bcrypt.provider';
import { UserDoc } from '../users/model/users.schema';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

const userData: UserDoc = {
  id: '11223344',
  email: 'test@example.com',
  firstName: 'Pepito',
  lastName: 'Juarez',
  password: '12345678',
  roles: [Role.SUPER_ADMIN],
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let bcryptProvider: Bcrypt;

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: BCRYPT,
          useValue: {
            genSaltSync: jest.fn(),
            hashSync: jest.fn(() => 'hash'),
            compareSync: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
    usersService = authModule.get<UsersService>(UsersService);
    bcryptProvider = authModule.get<Bcrypt>(BCRYPT);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(bcryptProvider).toBeDefined();
  });

  describe('function newPassword', () => {
    it('new password', async () => {
      const spy = jest.spyOn(usersService, 'newPassword');

      await authService.newPassword({ token: '123456', password: 'string' });

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('function login', () => {
    it('login user', async () => {
      const response = await authService.login(userData);
      expect(response).toBeDefined();
    });
  });

  describe('function validateUser', () => {
    it('validate  user', async () => {
      const spy = jest
        .spyOn(usersService, 'getByEmail')
        .mockImplementation(() => Promise.resolve(userData));

      const response = await authService.validateUser(
        userData.email,
        userData.password,
      );

      expect(response).toBeDefined();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('validate  user bad password', async () => {
      const spy = jest
        .spyOn(usersService, 'getByEmail')
        .mockImplementation(() => Promise.resolve(userData));
      const spyBycript = jest
        .spyOn(bcryptProvider, 'compareSync')
        .mockImplementation(() => false);

      const response = await authService.validateUser(
        userData.email,
        userData.password,
      );

      expect(response).toBeNull();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
      spyBycript.mockRestore();
    });
  });
  describe('function resetPassword', () => {
    it('reset password', async () => {
      const spy = jest.spyOn(usersService, 'resetPassword');

      await authService.resetPassword({ email: 'test@example.com' });

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
