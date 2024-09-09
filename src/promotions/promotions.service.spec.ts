import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { PromotionsRepository } from './promotions.repository';

jest.mock('./promotions.repository');

describe('ProductsService', () => {
  let service: PromotionsService;
  let repository: PromotionsRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [PromotionsService, PromotionsRepository],
    }).compile();

    service = testingModule.get<PromotionsService>(PromotionsService);
    repository = testingModule.get<PromotionsRepository>(PromotionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  // TODO: tests
});
