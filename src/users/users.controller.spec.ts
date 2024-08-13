import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CreateUserRequestDto } from './dto/createUserRequest.dto';

jest.mock('./users.service');

const userCreateReq: CreateUserRequestDto = {
  email: 'test@example.com',
  firstName: 'Pepe',
  lastName: 'Lopez',
  phoneNumber: '+54912345678',
};
const userId = '61d4c1b0bb013bc318c951d7';

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

  describe('count', () => {
    it('count users', async () => {
      const spy = jest.spyOn(usersService, 'count');

      await usersController.count();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('find by id', async () => {
      const spy = jest.spyOn(usersService, 'getById');

      await usersController.getById(userId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
