import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import {
  ProductCategoryDoc,
  ProductCategorySchema,
} from './model/productCategories.schema';
import { ProductCategory } from './model/productCategories.model';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { mongoDocParser } from '../common/utils/mongoDocParser';

@Injectable()
export class ProductCategoriesRepository {
  constructor(
    @InjectModel(ProductCategory)
    private readonly model: ReturnModelType<typeof ProductCategory>,
  ) {}

  private fromDbConverter(dbDoc: ProductCategory): ProductCategoryDoc {
    return mongoDocParser<ProductCategorySchema, ProductCategoryDoc>(dbDoc);
  }

  public async create(data: ProductCategorySchema): Promise<CreateDocResponse> {
    const response = await this.model.create(data);
    const { id } = this.fromDbConverter(response);
    return {
      id,
    };
  }

  public async getAll({
    page,
    limit,
    name,
    companyId,
  }: IQueryParams): Promise<PaginateResult<ProductCategoryDoc>> {
    const filters: any = {};
    if (name) {
      filters.name = { $regex: name };
    }
    if (companyId) {
      filters.companyId = companyId;
    }
    const result = await this.model.paginate(filters, {
      limit,
      page,
    });
    return {
      ...result,
      docs: result.docs.map((doc) => {
        return this.fromDbConverter(doc);
      }),
    };
  }

  public async getById(id: ID): Promise<ProductCategoryDoc | undefined> {
    const doc = await this.model.findOne({ _id: id });
    if (!doc) {
      return undefined;
    }
    return this.fromDbConverter(doc);
  }

  public async updateById(
    id: string,
    data: Partial<ProductCategorySchema>,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne({ _id: id }, data);
    return modifiedCount === 1;
  }

  public async deleteById(id: string): Promise<boolean> {
    const { modifiedCount } = await this.model.deleteById(id);
    return modifiedCount === 1;
  }
}
