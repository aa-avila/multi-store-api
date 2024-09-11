import { Test, TestingModule } from '@nestjs/testing';
import { StorefrontService } from './storefront.service';
import { PromotionsService } from '../promotions/promotions.service';
import { CompaniesService } from '../companies/companies.service';

jest.mock('../promotions/promotions.service');
jest.mock('../companies/companies.service');

describe('StorefrontService', () => {
  let storefrontService: StorefrontService;
  let promotionsService: PromotionsService;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [StorefrontService, PromotionsService, CompaniesService],
    }).compile();

    storefrontService = testingModule.get<StorefrontService>(StorefrontService);
    promotionsService = testingModule.get<PromotionsService>(PromotionsService);
    companiesService = testingModule.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(storefrontService).toBeDefined();
    expect(promotionsService).toBeDefined();
    expect(companiesService).toBeDefined();
  });

  // TODO: tests
});
