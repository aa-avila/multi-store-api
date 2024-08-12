import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { ICreateProduct } from './interfaces/ICreateProduct';
import { ProductDoc } from './model/products.schema';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductsRepository)
    private readonly repository: ProductsRepository,
  ) {}

  public async create(data: ICreateProduct): Promise<CreateDocResponse> {
    const response = await this.repository.create(data);
    return response;
  }

  public async getAll(
    queryFilters: IQueryParams,
  ): Promise<PaginateResult<ProductDoc>> {
    return this.repository.getAll(queryFilters);
  }

  public async getById(id: ID): Promise<ProductDoc> {
    const doc = await this.repository.getById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async updateById(
    id: string,
    productData: Partial<ICreateProduct>,
  ): Promise<boolean> {
    const result = await this.repository.updateById(id, productData);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.deleteById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
