import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { User } from './model/users.model';
import { UsersRepository } from './users.repository';

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

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
