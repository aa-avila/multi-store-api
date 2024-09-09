import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { Promotion } from './model/promotions.model';
import { PromotionsRepository } from './promotions.repository';

describe('ProductsRepository', () => {
  let repository: PromotionsRepository;

  const PromotionsModel = getModelForClass(Promotion, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    // console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsRepository,
        {
          provide: getModelToken('Promotion'),
          useValue: PromotionsModel,
        },
      ],
    }).compile();

    repository = testingModule.get<PromotionsRepository>(PromotionsRepository);
    await PromotionsModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // TODO: tests
});
