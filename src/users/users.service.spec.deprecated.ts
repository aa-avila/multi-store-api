import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './model/users.model';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';

// NO MEZCLAR PERAS CON MANZANAS
// TESTEAR SERVICE => REPOSITORY
// NADA DE MONGO ACA

const userCreateData = {
  email: 'test@example.com',
  firstName: 'Pepito',
  lastName: 'Perez',
};

describe('UsersService', () => {
  let usersService: UsersService;

  const UserModel = getModelForClass(User, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);

    const usersModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: BCRYPT,
          useValue: {
            genSaltSync: jest.fn(),
            hashSync: jest.fn(() => 'hash'),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
      ],
    }).compile();

    usersService = usersModule.get<UsersService>(UsersService);
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('function create', () => {
    it('create one object', async () => {
      const response = await usersService.create(userCreateData);
      expect(response.id).toBeDefined();
    });

    it('duplicate email', async () => {
      await UserModel.create(userCreateData);

      try {
        await usersService.create(userCreateData);
      } catch (error) {
        expect(error.status).toEqual(409);
      }
    });

    it('random error', async () => {
      try {
        await usersService.create(null);
      } catch (error) {
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('function findByEmail', () => {
    it('find by email', async () => {
      await UserModel.create(userCreateData);
      const response = await usersService.getByEmail(userCreateData.email);
      expect(response).toBeDefined();
    });
  });

  describe('function findOne', () => {
    it('find one User', async () => {
      const createUser = await UserModel.create(userCreateData);
      const response = await usersService.getById(createUser.id);
      expect(response.email).toEqual(userCreateData.email);
      expect(response.firstName).toEqual(userCreateData.firstName);
      expect(response.lastName).toEqual(userCreateData.lastName);
    });

    it('find an user that doesnt exist', async () => {
      const id = '61d4c1b0bb013bc318c951d4';
      try {
        await usersService.getById(id);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('function count', () => {
    it('count objects', async () => {
      await UserModel.create(userCreateData);
      const response = await usersService.count();
      expect(response).toEqual(1);
    });
  });

  describe('function newPassword', () => {
    it('new password', async () => {
      const user = {
        ...userCreateData,
        token: '1234',
      };

      const responseCreate = await UserModel.create(user);

      const response = await usersService.newPassword({
        token: user.token,
        password: '12345678',
      });

      expect(response).toBe(true);

      const responseFind = await UserModel.findById(responseCreate._id);

      expect(responseFind.password).toEqual('hash');
    });

    it('not found', async () => {
      const user = {
        ...userCreateData,
        token: '1234',
      };

      const responseCreate = await UserModel.create(user);

      const response = await usersService.newPassword({
        token: '4321',
        password: '12345678',
      });

      expect(response).toBe(false);

      const responseFind = await UserModel.findById(responseCreate._id);

      expect(responseFind.password).toBeUndefined();
    });
  });

  describe('function resetPassword', () => {
    it('reset password', async () => {
      const user = {
        ...userCreateData,
        token: '1234',
      };

      const responseCreate = await UserModel.create(user);

      const response = await usersService.resetPassword({
        email: 'test@example.com',
      });

      expect(response).toBe(true);

      const responseFind = await UserModel.findById(responseCreate._id);
      expect(responseFind.token).not.toEqual(user.token);
    });
  });
});
