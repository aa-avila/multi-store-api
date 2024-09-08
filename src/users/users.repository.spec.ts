import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { User } from './model/users.model';
import { UsersRepository } from './users.repository';
import { userCreateData } from './testData';

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
      expect(response.id).toEqual(createdUser.id);
      expect(response.email).toEqual(userCreateData.email);
      expect(response.firstName).toEqual(userCreateData.firstName);
      expect(response.lastName).toEqual(userCreateData.lastName);
      expect(response.phoneNumber).toEqual(userCreateData.phoneNumber);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const createdUser = await repository.createUser(userCreateData);
      const response = await repository.getById(createdUser.id);
      expect(response.id).toEqual(createdUser.id);
      expect(response.email).toEqual(userCreateData.email);
      expect(response.firstName).toEqual(userCreateData.firstName);
      expect(response.lastName).toEqual(userCreateData.lastName);
      expect(response.phoneNumber).toEqual(userCreateData.phoneNumber);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
    });
  });

  describe('updateById', () => {
    it('update By Id', async () => {
      const createdDoc = await repository.createUser(userCreateData);
      const updateResponse = await repository.updateById(createdDoc.id, {
        phoneNumber: '9876543210',
      });
      const getResp = await repository.getById(createdDoc.id);

      expect(updateResponse).toBe(true);
      expect(getResp.phoneNumber).toBe('9876543210');
    });
  });

  describe('setPasswordByToken', () => {
    it('setPasswordByToken => new password', async () => {
      const token = 'token1234';
      const createdUser = await repository.createUser({
        ...userCreateData,
        token,
      });
      const passHash = 'hash1234';
      const setPassResp = await repository.setPasswordByToken(token, passHash);
      const getResp2 = await repository.getById(createdUser.id);

      expect(setPassResp).toBe(true);
      expect(getResp2.password).toBe(passHash);
    });
  });

  describe('setTokenByEmail', () => {
    it('setTokenByEmail => reset password', async () => {
      const token = 'token1234';
      const email = userCreateData.email;
      const createdUser = await repository.createUser({
        ...userCreateData,
        token,
      });
      const newToken = 'new1234';
      await repository.getById(createdUser.id);
      const response = await repository.setTokenByEmail(email, newToken);
      const getResp = await repository.getById(createdUser.id);

      expect(response).toBe(true);
      expect(getResp.token).toBe(newToken);
    });
  });

  describe('count', () => {
    it('count docs', async () => {
      await repository.createUser(userCreateData);
      const response = await repository.count();
      expect(response).toEqual(1);
    });
  });

  describe('deleteById', () => {
    it('delete By Id', async () => {
      const createdDoc = await repository.createUser(userCreateData);
      const deleteResponse = await repository.deleteById(createdDoc.id);
      const getResp = await repository.getById(createdDoc.id);

      expect(deleteResponse).toBe(true);
      expect(getResp).toBe(undefined);
    });
  });
});
