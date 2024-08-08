import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { UsersService } from '../users/users.service';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/users.model';
import { Bcrypt } from '../common/bcrypt/bcrypt.provider';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

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

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function login', () => {
    it('login user', async () => {
      const user = {
        email: 'test@b21.com',
        firstName: 'string',
        lastName: 'string',
        _id: '3322323',
        roles: [Role.SUPER_ADMIN],
      };

      const response = await authService.login(user as unknown as User);

      expect(response).toBeDefined();
    });
  });

  describe('function validateUser', () => {
    it('validate  user', async () => {
      const user = {
        email: 'test@b21.com',
        firstName: 'string',
        lastName: 'string',
        _id: '3322323',
        password: '123456',
        roles: [Role.SUPER_ADMIN],
      };

      const spy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() => Promise.resolve(user as unknown as User));

      const response = await authService.validateUser(
        user.email,
        user.password,
      );

      expect(response).toBeDefined();

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
      spy.mockRestore();
    });

    it('validate  user bad password', async () => {
      const user = {
        email: 'test@b21.com',
        firstName: 'string',
        lastName: 'string',
        _id: '3322323',
        password: '123456',
        roles: [Role.SUPER_ADMIN],
      };

      const spy = jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() => Promise.resolve(user as unknown as User));

      const spyBycript = jest
        .spyOn(bcryptProvider, 'compareSync')
        .mockImplementation(() => false);

      const response = await authService.validateUser(
        user.email,
        user.password,
      );

      expect(response).toBeNull();

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);

      spy.mockRestore();
      spyBycript.mockRestore();
    });
  });
  describe('function resetPassword', () => {
    it('reset password', async () => {
      const spy = jest.spyOn(usersService, 'resetPassword');

      await authService.resetPassword({ email: 'test@b21.com' });

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
