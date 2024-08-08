import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { Product } from './products.model';
import { ProductsRepository } from './products.repository';

describe('ProductsRepository', () => {
  let repository: ProductsRepository;

  const ProductsModel = getModelForClass(Product, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    // console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);

    const productsModule: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: getModelToken('Product'),
          useValue: ProductsModel,
        },
      ],
    }).compile();

    repository = productsModule.get<ProductsRepository>(ProductsRepository);
    await ProductsModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
