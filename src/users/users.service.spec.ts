import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { UserDoc, UserSchema } from './model/users.schema';
import { Role } from '../common/enums/role.enum';

jest.mock('./users.repository');
const UsersRepositoryMock = jest.mocked(UsersRepository);

const userCreateData: UserSchema = {
  email: 'test@example.com',
  firstName: 'Pepito',
  lastName: 'Perez',
  roles: [Role.SUPER_ADMIN],
};
const userCreateResponse = { id: 'userId1234' };
const userGetDocResponse: UserDoc = {
  ...userCreateResponse,
  ...userCreateData,
};

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const productsModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: BCRYPT,
          useValue: {
            genSaltSync: jest.fn(() => 'salt'),
            hashSync: jest.fn(() => 'hash'),
          },
        },
      ],
    }).compile();

    usersService = productsModule.get<UsersService>(UsersService);
    usersRepository = productsModule.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('create', () => {
    it('create user', async () => {
      const spy =
        UsersRepositoryMock.prototype.createUser.mockResolvedValue(
          userCreateResponse,
        );
      const response = await usersService.create(userCreateData);
      expect(response).toEqual(userCreateResponse);
      expect(spy).toHaveBeenCalledWith({ ...userCreateData, token: 'salt' });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('create - duplicated email error 409', async () => {
      expect.assertions(2);

      const spy = UsersRepositoryMock.prototype.createUser.mockRejectedValue({
        code: 11000,
      });

      try {
        await usersService.create(userCreateData);
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });

    it('create - random error 500', async () => {
      expect.assertions(2);

      const spy = UsersRepositoryMock.prototype.createUser.mockRejectedValue(
        new Error('random error'),
      );

      try {
        await usersService.create(userCreateData);
      } catch (error) {
        expect(error.status).toEqual(500);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('getByEmail', () => {
    it('get by email', async () => {
      const spy =
        UsersRepositoryMock.prototype.getByEmail.mockResolvedValue(
          userGetDocResponse,
        );
      const response = await usersService.getByEmail(userCreateData.email);
      expect(response).toEqual(userGetDocResponse);
      expect(spy).toHaveBeenCalledWith(userCreateData.email);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('get by email - not found', async () => {
      expect.assertions(2);

      const spy =
        UsersRepositoryMock.prototype.getByEmail.mockResolvedValue(undefined);

      try {
        await usersService.getByEmail(userCreateData.email);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const spy =
        UsersRepositoryMock.prototype.getById.mockResolvedValue(
          userGetDocResponse,
        );
      const response = await usersService.getById(userCreateResponse.id);
      expect(response).toEqual(userGetDocResponse);
      expect(spy).toHaveBeenCalledWith(userCreateResponse.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('get by id - not found', async () => {
      expect.assertions(2);

      const spy =
        UsersRepositoryMock.prototype.getById.mockResolvedValue(undefined);

      try {
        await usersService.getById(userCreateResponse.id);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('count', () => {
    it('count docs', async () => {
      const spy = UsersRepositoryMock.prototype.count.mockResolvedValue(3);
      const response = await usersService.count();
      expect(response).toEqual(3);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('newPassword', () => {
    it('new password', async () => {
      const spy =
        UsersRepositoryMock.prototype.setPasswordByToken.mockResolvedValue(
          true,
        );
      const token = '1234';

      const response = await usersService.newPassword({
        token,
        password: '12345678',
      });

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(token, 'hash');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('new password - not found', async () => {
      expect.assertions(2);

      const spy =
        UsersRepositoryMock.prototype.setPasswordByToken.mockResolvedValue(
          false,
        );
      const token = '1234';

      try {
        await usersService.newPassword({
          token,
          password: '12345678',
        });
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('resetPassword', () => {
    it('reset password', async () => {
      const spy =
        UsersRepositoryMock.prototype.setTokenByEmail.mockResolvedValue(true);
      const email = 'test@example.com';

      const response = await usersService.resetPassword({
        email,
      });

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(email, 'salt');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('reset password - not found', async () => {
      expect.assertions(2);

      const spy =
        UsersRepositoryMock.prototype.setTokenByEmail.mockResolvedValue(false);
      const email = 'test@example.com';

      try {
        await usersService.resetPassword({
          email,
        });
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
