import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

jest.mock('./users.service');

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const usersModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = usersModule.get<UsersService>(UsersService);
    usersController = usersModule.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('function create', () => {
    it('create one object', async () => {
      const user = {
        email: 'test@b21.com',
        firstName: 'string',
        lastName: 'string',
      };

      const spy = jest.spyOn(usersService, 'create');

      await usersController.create(user);
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function count', () => {
    it('count all objects', async () => {
      const spy = jest.spyOn(usersService, 'count');

      await usersController.count();
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('function findOne', () => {
    it('find one User', async () => {
      const spy = jest.spyOn(usersService, 'findOne');

      await usersController.findOne('61d4c1b0bb013bc318c951d7');
      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
