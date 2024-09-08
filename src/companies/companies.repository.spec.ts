import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { Company } from './model/companies.model';
import { CompaniesRepository } from './companies.repository';
import { companyCreateData, companyUpdateData } from './testData';

describe('CompaniesRepository', () => {
  let repository: CompaniesRepository;

  const CompaniesModel = getModelForClass(Company, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);

    const companiesModule: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesRepository,
        {
          provide: getModelToken('Company'),
          useValue: CompaniesModel,
        },
      ],
    }).compile();

    repository = companiesModule.get<CompaniesRepository>(CompaniesRepository);
    await CompaniesModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('create company', async () => {
      const response = await repository.create(companyCreateData);
      expect(response.id).toBeDefined();
    });

    it('create - duplicated slug error', async () => {
      expect.assertions(1);

      await CompaniesModel.create(companyCreateData);

      try {
        await repository.create(companyCreateData);
      } catch (error) {
        expect(error.code).toEqual(11000);
      }
    });
  });

  describe('getAll', () => {
    it('get all without filters', async () => {
      const createdDoc = await repository.create(companyCreateData);
      const response = await repository.getAll({});
      const { docs } = response;
      expect(docs).toBeDefined();
      expect(docs.length).toBe(1);
      expect(docs[0].id).toBe(createdDoc.id);
      expect(docs[0].slug).toBe(companyCreateData.slug);
      expect(docs[0].name).toBe(companyCreateData.name);
      expect(docs[0].ownerId).toBe(companyCreateData.ownerId);
    });

    it('get all with name filter - ok results', async () => {
      const createdDoc = await repository.create(companyCreateData);
      const response = await repository.getAll({
        name: companyCreateData.name,
      });
      const { docs } = response;
      expect(docs).toBeDefined();
      expect(docs.length).toBe(1);
      expect(docs[0].id).toBe(createdDoc.id);
      expect(docs[0].slug).toBe(companyCreateData.slug);
      expect(docs[0].name).toBe(companyCreateData.name);
      expect(docs[0].ownerId).toBe(companyCreateData.ownerId);
    });

    it('get all with name filter - NO results', async () => {
      await repository.create(companyCreateData);
      const response = await repository.getAll({ name: 'qwertyasdf' });
      const { docs } = response;
      expect(docs).toBeDefined();
      expect(docs.length).toBe(0);
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const createdDoc = await repository.create(companyCreateData);
      const response = await repository.getById(createdDoc.id);
      expect(response.id).toEqual(createdDoc.id);
      expect(response.slug).toEqual(companyCreateData.slug);
      expect(response.name).toEqual(companyCreateData.name);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
    });
  });

  describe('getBySlug', () => {
    it('get by email', async () => {
      const createdDoc = await repository.create(companyCreateData);
      const response = await repository.getBySlug(companyCreateData.slug);
      expect(response.id).toEqual(createdDoc.id);
      expect(response.slug).toEqual(companyCreateData.slug);
      expect(response.name).toEqual(companyCreateData.name);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
    });
  });

  describe('updateById', () => {
    it('update By Id', async () => {
      const createdDoc = await repository.create(companyCreateData);
      const updateResponse = await repository.updateById(
        createdDoc.id,
        companyUpdateData,
      );
      const getResp = await repository.getById(createdDoc.id);

      expect(updateResponse).toBe(true);
      expect(getResp.name).toBe(companyUpdateData.name);
    });
  });

  describe('deleteById', () => {
    it('delete By Id', async () => {
      const createdDoc = await repository.create(companyCreateData);
      const deleteResponse = await repository.deleteById(createdDoc.id);
      const getResp = await repository.getById(createdDoc.id);

      expect(deleteResponse).toBe(true);
      expect(getResp).toBe(undefined);
    });
  });
});
