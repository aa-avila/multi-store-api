import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

jest.mock('./products.repository');

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;

  beforeEach(async () => {
    const productsModule: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, ProductsRepository],
    }).compile();

    service = productsModule.get<ProductsService>(ProductsService);
    repository = productsModule.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
