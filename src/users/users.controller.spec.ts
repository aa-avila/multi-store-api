import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userCreateReq, userId, userUpdateData } from './testData';

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

  describe('create', () => {
    it('create new user', async () => {
      const spy = jest.spyOn(usersService, 'create');

      await usersController.create(userCreateReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('get by all', async () => {
      const spy = jest.spyOn(usersService, 'getAll');

      await usersController.getAll(1, 1);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const spy = jest.spyOn(usersService, 'getById');

      await usersController.getById(userId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateById', () => {
    it('update by id', async () => {
      const spy = jest.spyOn(usersService, 'updateById');

      await usersController.updateById(userId, userUpdateData);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteById', () => {
    it('delete by id', async () => {
      const spy = jest.spyOn(usersService, 'deleteById');

      await usersController.deleteById(userId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('count', () => {
    it('count users', async () => {
      const spy = jest.spyOn(usersService, 'count');

      await usersController.count();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
