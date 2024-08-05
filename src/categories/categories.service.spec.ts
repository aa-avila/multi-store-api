/* eslint-disable no-plusplus */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { Category } from './categories.model';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  const CategoriesModel = getModelForClass(Category, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    // console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);

    const categoriesModule: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken('Category'),
          useValue: CategoriesModel,
        },
      ],
    }).compile();

    categoriesService =
      categoriesModule.get<CategoriesService>(CategoriesService);
    await CategoriesModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  // describe('function create', () => {
  //   it('create one object', async () => {
  //     const pet = {
  //       name: 'Firulais',
  //       type: 'perro',
  //       sex: 'male',
  //       weight: 23,
  //       color: 'negro',
  //       birthday: '2020-06-03',
  //       notes: 'Responde al apodo Firu',
  //       owners: ['61d433863260b40e79f87db1'],
  //     };

  //     const response = await petsService.create(pet);
  //     expect(response.name).toEqual(pet.name);
  //     expect(response.type).toEqual(pet.type);
  //     expect(response.sex).toEqual(pet.sex);
  //     expect(response.weight).toEqual(pet.weight);
  //     expect(response.color).toEqual(pet.color);
  //     expect(response.birthday).toEqual(pet.birthday);
  //     expect(response.notes).toEqual(pet.notes);
  //     expect(Array.from(response.owners)).toEqual(['61d433863260b40e79f87db1']);
  //   });
  // });

  // describe('function findAll', () => {
  //   const testDocsNum = 5;
  //   beforeEach(async () => {
  //     const examplePets = [];
  //     for (let i = 0; i < testDocsNum; i++) {
  //       const pet = {
  //         name: `example_${i}`,
  //         type: 'gato',
  //         weight: 20 + i,
  //       };
  //       examplePets.push(pet);
  //     }

  //     await Promise.all(
  //       examplePets.map(async (pet) => {
  //         await PetModel.create(pet);
  //       }),
  //     );
  //   });

  //   it('get all pets with no filters', async () => {
  //     const filters = {
  //       limit: null,
  //       page: null,
  //       name: null,
  //     };
  //     const response = await petsService.findAll(filters);

  //     expect(response.totalDocs).toEqual(testDocsNum);
  //   });

  //   it('get all pets - no name', async () => {
  //     const filters = {
  //       limit: 10,
  //       page: 1,
  //       name: null,
  //     };
  //     const response = await petsService.findAll(filters);

  //     expect(response.totalDocs).toEqual(testDocsNum);
  //   });

  //   it('get all pets with all filters', async () => {
  //     const filters = {
  //       limit: 10,
  //       page: 1,
  //       name: 'example_0',
  //     };
  //     const response = await petsService.findAll(filters);

  //     expect(response.totalDocs).toEqual(1);
  //     expect(response.docs[0].name).toEqual('example_0');
  //   });
  // });

  // describe('function findOne', () => {
  //   it('get one pet', async () => {
  //     const pet = {
  //       name: 'example_pet',
  //       type: 'gato',
  //       weight: 15,
  //     };

  //     const responseCreate = await PetModel.create(pet);
  //     const response = await petsService.findOne(responseCreate._id.toString());

  //     expect(response.name).toEqual(pet.name);
  //   });

  //   it('find a pet that doesnt exist', async () => {
  //     const id = '123412341234123412341234';

  //     expect.assertions(1);
  //     try {
  //       await petsService.findOne(id);
  //     } catch (error) {
  //       expect(error.status).toEqual(404);
  //     }
  //   });
  // });

  // describe('function update', () => {
  //   it('update a pet', async () => {
  //     const pet = {
  //       name: 'example_pet',
  //       type: 'gato',
  //       weight: 15,
  //     };
  //     const responseCreate = await PetModel.create(pet);

  //     const petUpdate = {
  //       name: 'updated_pet',
  //       type: 'perro',
  //       weight: 25,
  //     };
  //     const response = await petsService.update(
  //       responseCreate._id.toString(),
  //       petUpdate,
  //     );

  //     expect(response).toBe(true);

  //     const responseFind = await PetModel.findById(responseCreate._id);

  //     expect(responseFind.name).toEqual(petUpdate.name);
  //     expect(responseFind.type).toEqual(petUpdate.type);
  //     expect(responseFind.weight).toEqual(petUpdate.weight);
  //   });

  //   it('update a pet that doesnt exist', async () => {
  //     const id = '123412341234123412341234';

  //     const petUpdate = {
  //       name: 'updated_pet',
  //       type: 'perro',
  //       weight: 25,
  //     };

  //     const response = await petsService.update(id, petUpdate);
  //     expect(response).toBe(false);
  //   });
  // });

  // describe('function delete', () => {
  //   it('delete a pet', async () => {
  //     const pet = {
  //       name: 'example_pet',
  //       type: 'gato',
  //       weight: 15,
  //     };

  //     const { _id: createdPetId } = await PetModel.create(pet);
  //     const response = await petsService.delete(createdPetId.toString());

  //     expect(response).toBe(true);

  //     const responseFind = await PetModel.findById(createdPetId.toString());
  //     expect(responseFind).toBeNull();
  //   });

  //   it('delete a pet that doesnt exist', async () => {
  //     const id = '123412341234123412341234';

  //     const response = await petsService.delete(id);
  //     expect(response).toBe(false);
  //   });
  // });
});
