import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

jest.mock('./promotions.service');

describe('PromotionsController', () => {
  let controller: PromotionsController;
  let service: PromotionsService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [PromotionsController],
      providers: [PromotionsService],
    }).compile();

    controller = testingModule.get<PromotionsController>(PromotionsController);
    service = testingModule.get<PromotionsService>(PromotionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // TODO: tests
});
