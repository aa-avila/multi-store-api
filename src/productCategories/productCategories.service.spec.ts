import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesService } from './productCategories.service';
import { ProductCategoriesRepository } from './productCategories.repository';
import { ProductCategoryDoc } from './model/productCategories.schema';
import { ConfigService } from '@nestjs/config';
import { createData, companyId, updateData } from './testData';

jest.mock('./productCategories.repository');
const ProductCategoriesRepositoryMock = jest.mocked(
  ProductCategoriesRepository,
);

const createResponse = { id: 'userId1234' };
const getDocResponse: ProductCategoryDoc = {
  ...createResponse,
  ...createData,
};

describe('ProductCategoryService', () => {
  let productCategoriesService: ProductCategoriesService;
  let productCategoriesRepository: ProductCategoriesRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoriesService,
        ProductCategoriesRepository,
        ConfigService,
      ],
    }).compile();

    productCategoriesService = testingModule.get<ProductCategoriesService>(
      ProductCategoriesService,
    );
    productCategoriesRepository =
      testingModule.get<ProductCategoriesRepository>(
        ProductCategoriesRepository,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productCategoriesService).toBeDefined();
    expect(productCategoriesRepository).toBeDefined();
  });

  describe('create', () => {
    it('create ok', async () => {
      const spy =
        ProductCategoriesRepositoryMock.prototype.create.mockResolvedValue(
          createResponse,
        );
      const response = await productCategoriesService.create(createData);
      expect(response).toEqual(createResponse);
      expect(spy).toHaveBeenCalledWith({
        ...createData,
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('get all', async () => {
      const spy =
        ProductCategoriesRepositoryMock.prototype.getAll.mockResolvedValue({
          docs: [getDocResponse],
          totalDocs: 1,
          totalPages: 1,
          limit: 50,
          hasPrevPage: false,
          hasNextPage: false,
          offset: 0,
          pagingCounter: 1,
        });
      const response = await productCategoriesService.getAll({});
      expect(response).toBeDefined();
      expect(response.docs).toEqual([getDocResponse]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const spy =
        ProductCategoriesRepositoryMock.prototype.getById.mockResolvedValue(
          getDocResponse,
        );
      const response = await productCategoriesService.getById(
        createResponse.id,
      );
      expect(response).toEqual(getDocResponse);
      expect(spy).toHaveBeenCalledWith(createResponse.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('get by id - not found', async () => {
      expect.assertions(2);

      const spy =
        ProductCategoriesRepositoryMock.prototype.getById.mockResolvedValue(
          undefined,
        );

      try {
        await productCategoriesService.getById(createResponse.id);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('updateById', () => {
    it('update By Id', async () => {
      const spy =
        ProductCategoriesRepositoryMock.prototype.updateById.mockResolvedValue(
          true,
        );

      const response = await productCategoriesService.updateById(
        companyId,
        updateData,
      );

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(companyId, updateData);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('update By Id - not found', async () => {
      expect.assertions(2);

      const spy =
        ProductCategoriesRepositoryMock.prototype.updateById.mockResolvedValue(
          false,
        );

      try {
        await productCategoriesService.updateById(companyId, updateData);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('deleteById', () => {
    it('delete By Id', async () => {
      const spy =
        ProductCategoriesRepositoryMock.prototype.deleteById.mockResolvedValue(
          true,
        );

      const response = await productCategoriesService.deleteById(companyId);

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(companyId);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('delete By Id - not found', async () => {
      expect.assertions(2);

      const spy =
        ProductCategoriesRepositoryMock.prototype.deleteById.mockResolvedValue(
          false,
        );

      try {
        await productCategoriesService.deleteById(companyId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
