import { Test, TestingModule } from '@nestjs/testing';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';

jest.mock('./storefront.service');

describe('StorefrontController', () => {
  let controller: StorefrontController;
  let service: StorefrontService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [StorefrontController],
      providers: [StorefrontService],
    }).compile();

    controller = testingModule.get<StorefrontController>(StorefrontController);
    service = testingModule.get<StorefrontService>(StorefrontService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // TODO: tests
});
