import { CreateProductCategoryRequestDto } from '../dto/createProductCategoryRequest.dto';
import { ICreateProductCategory } from '../interfaces/ICreateProductCategory';

export const companyId = '61d4c1b0bb013bc318c951d7';

export const createData: ICreateProductCategory = {
  name: 'Category name',
  description: 'The description bla bla bla.',
  image: 'https://host.com/images/example.jpg',
  companyId,
};

export const updateData: Partial<ICreateProductCategory> = {
  name: 'The New name',
};

export const createReq: CreateProductCategoryRequestDto = {
  ...createData,
};
