import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { UserDoc } from './model/users.schema';
import { ConfigService } from '@nestjs/config';
import { companyId, userCreateData, userId, userUpdateData } from './testData';

jest.mock('./users.repository');
const UsersRepositoryMock = jest.mocked(UsersRepository);

const userCreateResponse = { id: 'userId1234' };
const userGetDocResponse: UserDoc = {
  ...userCreateResponse,
  ...userCreateData,
};
const testToken = 'token1234';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const productsModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        ConfigService,
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
      expect(spy).toHaveBeenCalledWith({ ...userCreateData, token: testToken });
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

  describe('getAll', () => {
    it('get all', async () => {
      const spy = UsersRepositoryMock.prototype.getAll.mockResolvedValue({
        docs: [userGetDocResponse],
        totalDocs: 1,
        totalPages: 1,
        limit: 50,
        hasPrevPage: false,
        hasNextPage: false,
        offset: 0,
        pagingCounter: 1,
      });
      const response = await usersService.getAll({});
      expect(response).toBeDefined();
      expect(response.docs).toEqual([userGetDocResponse]);
      expect(spy).toHaveBeenCalledTimes(1);
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

  describe('updateById', () => {
    it('update By Id', async () => {
      const spy =
        UsersRepositoryMock.prototype.updateById.mockResolvedValue(true);

      const response = await usersService.updateById(companyId, userUpdateData);

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(companyId, userUpdateData);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('update By Id - not found', async () => {
      expect.assertions(2);

      const spy =
        UsersRepositoryMock.prototype.updateById.mockResolvedValue(false);

      try {
        await usersService.updateById(companyId, userUpdateData);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
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
      expect(spy).toHaveBeenCalledWith(email, testToken);
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

  describe('deleteById', () => {
    it('delete By Id', async () => {
      const spy =
        UsersRepositoryMock.prototype.deleteById.mockResolvedValue(true);

      const response = await usersService.deleteById(userId);

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(userId);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('delete By Id - not found', async () => {
      expect.assertions(2);

      const spy =
        UsersRepositoryMock.prototype.deleteById.mockResolvedValue(false);

      try {
        await usersService.deleteById(userId);
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
});
