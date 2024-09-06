import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { companyCreateReq, companyId, companyUpdateData } from './testData';

jest.mock('./companies.service');

describe('CompaniesController', () => {
  let companiesService: CompaniesService;
  let companiesController: CompaniesController;

  beforeEach(async () => {
    const companiesModule: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [CompaniesService],
    }).compile();

    companiesService = companiesModule.get<CompaniesService>(CompaniesService);
    companiesController =
      companiesModule.get<CompaniesController>(CompaniesController);
  });

  it('should be defined', () => {
    expect(companiesController).toBeDefined();
    expect(companiesService).toBeDefined();
  });

  describe('create', () => {
    it('create new', async () => {
      const spy = jest.spyOn(companiesService, 'create');

      await companiesController.create(companyCreateReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('get by all', async () => {
      const spy = jest.spyOn(companiesService, 'getAll');

      await companiesController.getAll(1, 1);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const spy = jest.spyOn(companiesService, 'getById');

      await companiesController.getById(companyId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBySlug', () => {
    it('get by slug', async () => {
      const spy = jest.spyOn(companiesService, 'getBySlug');

      await companiesController.getBySlug(companyId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateById', () => {
    it('update by id', async () => {
      const spy = jest.spyOn(companiesService, 'updateById');

      await companiesController.updateById(companyId, companyUpdateData);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteById', () => {
    it('delete by id', async () => {
      const spy = jest.spyOn(companiesService, 'deleteById');

      await companiesController.deleteById(companyId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
