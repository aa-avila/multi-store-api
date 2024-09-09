import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { ProductCategory } from './model/productCategories.model';
import { ProductCategoriesRepository } from './productCategories.repository';
import { createData, updateData } from './testData';

describe('ProductCategoriesRepository', () => {
  let repository: ProductCategoriesRepository;

  const ProductCategoriesModel = getModelForClass(ProductCategory, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL);

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoriesRepository,
        {
          provide: getModelToken('ProductCategory'),
          useValue: ProductCategoriesModel,
        },
      ],
    }).compile();

    repository = testingModule.get<ProductCategoriesRepository>(
      ProductCategoriesRepository,
    );
    await ProductCategoriesModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('create company', async () => {
      const response = await repository.create(createData);
      expect(response.id).toBeDefined();
    });
  });

  describe('getAll', () => {
    it('get all without filters', async () => {
      const createdDoc = await repository.create(createData);
      const response = await repository.getAll({});
      const { docs } = response;
      expect(docs).toBeDefined();
      expect(docs.length).toBe(1);
      expect(docs[0].id).toBe(createdDoc.id);
      expect(docs[0].name).toBe(createData.name);
      expect(docs[0].description).toBe(createData.description);
      expect(docs[0].image).toBe(createData.image);
      expect(docs[0].companyId).toBe(createData.companyId);
    });

    it('get all with name filter - ok results', async () => {
      const createdDoc = await repository.create(createData);
      const response = await repository.getAll({
        name: createData.name,
      });
      const { docs } = response;
      expect(docs).toBeDefined();
      expect(docs.length).toBe(1);
      expect(docs[0].id).toBe(createdDoc.id);
      expect(docs[0].name).toBe(createData.name);
      expect(docs[0].description).toBe(createData.description);
      expect(docs[0].image).toBe(createData.image);
      expect(docs[0].companyId).toBe(createData.companyId);
    });

    it('get all with name filter - NO results', async () => {
      await repository.create(createData);
      const response = await repository.getAll({ name: 'qwertyasdf' });
      const { docs } = response;
      expect(docs).toBeDefined();
      expect(docs.length).toBe(0);
    });
  });

  describe('getById', () => {
    it('get by id', async () => {
      const createdDoc = await repository.create(createData);
      const response = await repository.getById(createdDoc.id);
      expect(response.id).toEqual(createdDoc.id);
      expect(response.name).toEqual(createData.name);
      expect(response.description).toBe(createData.description);
      expect(response.image).toBe(createData.image);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
    });
  });

  describe('updateById', () => {
    it('update By Id', async () => {
      const createdDoc = await repository.create(createData);
      const updateResponse = await repository.updateById(
        createdDoc.id,
        updateData,
      );
      const getResp = await repository.getById(createdDoc.id);

      expect(updateResponse).toBe(true);
      expect(getResp.name).toBe(updateData.name);
    });
  });

  describe('deleteById', () => {
    it('delete By Id', async () => {
      const createdDoc = await repository.create(createData);
      const deleteResponse = await repository.deleteById(createdDoc.id);
      const getResp = await repository.getById(createdDoc.id);

      expect(deleteResponse).toBe(true);
      expect(getResp).toBe(undefined);
    });
  });
});
