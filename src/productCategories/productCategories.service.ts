import { Injectable, Inject, NotFoundException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { PaginateResult } from 'mongoose';
import { ProductCategoriesRepository } from './productCategories.repository';
import { ProductCategoryDoc } from './model/productCategories.schema';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { ICreateProductCategory } from './interfaces/ICreateProductCategory';
import { CreateDocResponse } from '../common/types/createDocResponse';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @Inject(ProductCategoriesRepository)
    private readonly repository: ProductCategoriesRepository,
    // private configService: ConfigService,
  ) {}

  async create(data: ICreateProductCategory): Promise<CreateDocResponse> {
    return this.repository.create(data);
  }

  public async getAll(
    queryFilters: IQueryParams,
  ): Promise<PaginateResult<ProductCategoryDoc>> {
    return this.repository.getAll(queryFilters);
  }

  public async getById(id: ID): Promise<ProductCategoryDoc> {
    const doc = await this.repository.getById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async updateById(
    id: string,
    updateData: Partial<ICreateProductCategory>,
  ): Promise<boolean> {
    const result = await this.repository.updateById(id, updateData);
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
