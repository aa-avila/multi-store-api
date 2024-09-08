import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { CompaniesRepository } from './companies.repository';
import { CompanyDoc } from './model/companies.schema';
import { ConfigService } from '@nestjs/config';
import { companyCreateData, companyId, companyUpdateData } from './testData';

jest.mock('./companies.repository');
const CompaniesRepositoryMock = jest.mocked(CompaniesRepository);

const companyCreateResponse = { id: 'userId1234' };
const companyGetDocResponse: CompanyDoc = {
  ...companyCreateResponse,
  ...companyCreateData,
};

describe('CompaniesService', () => {
  let companiesService: CompaniesService;
  let companiesRepository: CompaniesRepository;

  beforeEach(async () => {
    const companiesModule: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService, CompaniesRepository, ConfigService],
    }).compile();

    companiesService = companiesModule.get<CompaniesService>(CompaniesService);
    companiesRepository =
      companiesModule.get<CompaniesRepository>(CompaniesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(companiesService).toBeDefined();
    expect(companiesRepository).toBeDefined();
  });

  describe('create', () => {
    it('create ok', async () => {
      const spy = CompaniesRepositoryMock.prototype.create.mockResolvedValue(
        companyCreateResponse,
      );
      const response = await companiesService.create(companyCreateData);
      expect(response).toEqual(companyCreateResponse);
      expect(spy).toHaveBeenCalledWith({
        ...companyCreateData,
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('create - duplicated slug error 409', async () => {
      expect.assertions(2);

      const spy = CompaniesRepositoryMock.prototype.create.mockRejectedValue({
        code: 11000,
      });

      try {
        await companiesService.create(companyCreateData);
      } catch (error) {
        expect(error.status).toEqual(409);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });

    it('create - random error 500', async () => {
      expect.assertions(2);

      const spy = CompaniesRepositoryMock.prototype.create.mockRejectedValue(
        new Error('random error'),
      );

      try {
        await companiesService.create(companyCreateData);
      } catch (error) {
        expect(error.status).toEqual(500);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('getAll', () => {
    it('get all', async () => {
      const spy = CompaniesRepositoryMock.prototype.getAll.mockResolvedValue({
        docs: [companyGetDocResponse],
        totalDocs: 1,
        totalPages: 1,
        limit: 50,
        hasPrevPage: false,
        hasNextPage: false,
        offset: 0,
        pagingCounter: 1,
      });
      const response = await companiesService.getAll({});
      expect(response).toBeDefined();
      expect(response.docs).toEqual([companyGetDocResponse]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const spy = CompaniesRepositoryMock.prototype.getById.mockResolvedValue(
        companyGetDocResponse,
      );
      const response = await companiesService.getById(companyCreateResponse.id);
      expect(response).toEqual(companyGetDocResponse);
      expect(spy).toHaveBeenCalledWith(companyCreateResponse.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('get by id - not found', async () => {
      expect.assertions(2);

      const spy =
        CompaniesRepositoryMock.prototype.getById.mockResolvedValue(undefined);

      try {
        await companiesService.getById(companyCreateResponse.id);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('getBySlug', () => {
    it('get by slug', async () => {
      const spy = CompaniesRepositoryMock.prototype.getBySlug.mockResolvedValue(
        companyGetDocResponse,
      );
      const response = await companiesService.getBySlug(companyCreateData.slug);
      expect(response).toEqual(companyGetDocResponse);
      expect(spy).toHaveBeenCalledWith(companyCreateData.slug);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('get by slug - not found', async () => {
      expect.assertions(2);

      const spy =
        CompaniesRepositoryMock.prototype.getBySlug.mockResolvedValue(
          undefined,
        );

      try {
        await companiesService.getBySlug(companyCreateData.slug);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('updateById', () => {
    it('update By Id', async () => {
      const spy =
        CompaniesRepositoryMock.prototype.updateById.mockResolvedValue(true);

      const response = await companiesService.updateById(
        companyId,
        companyUpdateData,
      );

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(companyId, companyUpdateData);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('update By Id - not found', async () => {
      expect.assertions(2);

      const spy =
        CompaniesRepositoryMock.prototype.updateById.mockResolvedValue(false);

      try {
        await companiesService.updateById(companyId, companyUpdateData);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('deleteById', () => {
    it('delete By Id', async () => {
      const spy =
        CompaniesRepositoryMock.prototype.deleteById.mockResolvedValue(true);

      const response = await companiesService.deleteById(companyId);

      expect(response).toBe(true);
      expect(spy).toHaveBeenCalledWith(companyId);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('delete By Id - not found', async () => {
      expect.assertions(2);

      const spy =
        CompaniesRepositoryMock.prototype.deleteById.mockResolvedValue(false);

      try {
        await companiesService.deleteById(companyId);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(spy).toHaveBeenCalledTimes(1);
      }
    });
  });
});
