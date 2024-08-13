import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { User } from './model/users.model';
import { UsersRepository } from './users.repository';
import { UserSchema } from './model/users.schema';
import { Role } from '../common/enums/role.enum';

const userCreateData: UserSchema = {
  email: 'test@example.com',
  firstName: 'Pepito',
  lastName: 'Perez',
  roles: [Role.SUPER_ADMIN],
};

describe('UsersRepository', () => {
  let repository: UsersRepository;

  const UsersModel = getModelForClass(User, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    // console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);

    const usersModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken('User'),
          useValue: UsersModel,
        },
      ],
    }).compile();

    repository = usersModule.get<UsersRepository>(UsersRepository);
    await UsersModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('create user', async () => {
      const response = await repository.createUser(userCreateData);
      expect(response.id).toBeDefined();
    });

    it('create - duplicated email error', async () => {
      expect.assertions(1);

      await UsersModel.create(userCreateData);

      try {
        await repository.createUser(userCreateData);
      } catch (error) {
        expect(error.code).toEqual(11000);
      }
    });
  });

  describe('getByEmail', () => {
    it('get by email', async () => {
      const createdUser = await repository.createUser(userCreateData);
      const response = await repository.getByEmail(userCreateData.email);
      console.log({ response });
      expect(createdUser.id).toEqual(createdUser.id);
      expect(userCreateData.email).toEqual(response.email);
      expect(userCreateData.firstName).toEqual(response.firstName);
      expect(userCreateData.lastName).toEqual(response.lastName);
    });
  });

  // describe('getById', () => {
  //   it('get by id', async () => {
  //     const spy =
  //       UsersRepositoryMock.prototype.getById.mockResolvedValue(
  //         userGetDocResponse,
  //       );
  //     const response = await usersService.getById(userCreateResponse.id);
  //     expect(response).toEqual(userGetDocResponse);
  //     expect(spy).toHaveBeenCalledWith(userCreateResponse.id);
  //     expect(spy).toHaveBeenCalledTimes(1);
  //   });

  //   it('get by id - not found', async () => {
  //     expect.assertions(2);

  //     const spy =
  //       UsersRepositoryMock.prototype.getById.mockResolvedValue(undefined);

  //     try {
  //       await usersService.getById(userCreateResponse.id);
  //     } catch (error) {
  //       expect(error.status).toEqual(404);
  //       expect(spy).toHaveBeenCalledTimes(1);
  //     }
  //   });
  // });

  // describe('count', () => {
  //   it('count docs', async () => {
  //     const spy = UsersRepositoryMock.prototype.count.mockResolvedValue(3);
  //     const response = await usersService.count();
  //     expect(response).toEqual(3);
  //     expect(spy).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('newPassword', () => {
  //   it('new password', async () => {
  //     const spy =
  //       UsersRepositoryMock.prototype.setPasswordByToken.mockResolvedValue(
  //         true,
  //       );
  //     const token = '1234';

  //     const response = await usersService.newPassword({
  //       token,
  //       password: '12345678',
  //     });

  //     expect(response).toBe(true);
  //     expect(spy).toHaveBeenCalledWith(token, 'hash');
  //     expect(spy).toHaveBeenCalledTimes(1);
  //   });

  //   it('new password - not found', async () => {
  //     expect.assertions(2);

  //     const spy =
  //       UsersRepositoryMock.prototype.setPasswordByToken.mockResolvedValue(
  //         false,
  //       );
  //     const token = '1234';

  //     try {
  //       await usersService.newPassword({
  //         token,
  //         password: '12345678',
  //       });
  //     } catch (error) {
  //       expect(error.status).toEqual(404);
  //       expect(spy).toHaveBeenCalledTimes(1);
  //     }
  //   });
  // });

  // describe('resetPassword', () => {
  //   it('reset password', async () => {
  //     const spy =
  //       UsersRepositoryMock.prototype.setTokenByEmail.mockResolvedValue(true);
  //     const email = 'test@example.com';

  //     const response = await usersService.resetPassword({
  //       email,
  //     });

  //     expect(response).toBe(true);
  //     expect(spy).toHaveBeenCalledWith(email, 'salt');
  //     expect(spy).toHaveBeenCalledTimes(1);
  //   });

  //   it('reset password - not found', async () => {
  //     expect.assertions(2);

  //     const spy =
  //       UsersRepositoryMock.prototype.setTokenByEmail.mockResolvedValue(false);
  //     const email = 'test@example.com';

  //     try {
  //       await usersService.resetPassword({
  //         email,
  //       });
  //     } catch (error) {
  //       expect(error.status).toEqual(404);
  //       expect(spy).toHaveBeenCalledTimes(1);
  //     }
  //   });
  // });
});
