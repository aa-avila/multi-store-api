import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

jest.mock('./auth.service');

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const authModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = authModule.get<AuthService>(AuthService);
    authController = authModule.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('function login', () => {
    it('login user', async () => {
      const req = {
        user: {
          email: 'test@b21.com',
          password: 'string',
        },
      };

      const spy = jest.spyOn(authService, 'login');

      await authController.login(req);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function newPassword', () => {
    it('new password user', async () => {
      const spy = jest.spyOn(authService, 'newPassword');

      await authController.newPassword({
        token: '123456',
        password: 'string',
      });

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function resetPassword', () => {
    it('reset password, generate token', async () => {
      const spy = jest.spyOn(authService, 'resetPassword');

      await authController.resetPassword({
        email: 'test@b21.com',
      });

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
