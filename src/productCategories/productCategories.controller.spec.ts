import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesService as ProductCategoriesService } from './productCategories.service';
import { ProductCategoriesController } from './productCategories.controller';
import { createReq, companyId, updateData } from './testData';
import { Role } from '../common/enums/role.enum';

jest.mock('./productCategories.service');

describe('ProductCategoriesController', () => {
  let companiesService: ProductCategoriesService;
  let companiesController: ProductCategoriesController;

  beforeEach(async () => {
    const companiesModule: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoriesController],
      providers: [ProductCategoriesService],
    }).compile();

    companiesService = companiesModule.get<ProductCategoriesService>(
      ProductCategoriesService,
    );
    companiesController = companiesModule.get<ProductCategoriesController>(
      ProductCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(companiesController).toBeDefined();
    expect(companiesService).toBeDefined();
  });

  describe('create', () => {
    it('create new', async () => {
      const spy = jest.spyOn(companiesService, 'create');

      await companiesController.create(createReq);
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

  describe('updateById', () => {
    it('update by id', async () => {
      const spy = jest.spyOn(companiesService, 'updateById');

      await companiesController.updateById(companyId, updateData);
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

  describe('getOwn', () => {
    it('get Own', async () => {
      const spy = jest.spyOn(companiesService, 'getAll');

      await companiesController.getOwn(
        {
          companyId,
          roles: [Role.COMPANY_ADMIN],
          email: 'email@test.com',
          userId: '66df0d1f146ec2ea1ca5a6cc',
        },
        1,
        1,
      );
      expect(spy).toHaveBeenCalledWith({ companyId, page: 1, limit: 1 });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
