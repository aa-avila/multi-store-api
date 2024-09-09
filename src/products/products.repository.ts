import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { ProductDoc, ProductSchema } from './model/products.schema';
import { Product } from './model/products.model';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { mongoDocParser } from '../common/utils/mongoDocParser';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product)
    private readonly model: ReturnModelType<typeof Product>,
  ) {}

  private fromDbConverter(dbDoc: Product): ProductDoc {
    return mongoDocParser<ProductSchema, ProductDoc>(dbDoc);
  }

  public async create(data: ProductSchema): Promise<CreateDocResponse> {
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
  }: IQueryParams): Promise<PaginateResult<ProductDoc>> {
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
      populate: { path: 'categories', select: { _id: 1, name: 1 } }, // TODO: check select fields
    });
    return {
      ...result,
      docs: result.docs.map((doc) => {
        return this.fromDbConverter(doc);
      }),
    };
  }

  public async getById(id: ID): Promise<ProductDoc | undefined> {
    const doc = await this.model
      .findOne({ _id: id })
      .populate('categories', { _id: 1, name: 1 }); // TODO: check select fields
    if (!doc) {
      return undefined;
    }
    return this.fromDbConverter(doc);
  }

  public async updateById(
    id: string,
    data: Partial<ProductSchema>,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne({ _id: id }, data);
    return modifiedCount === 1;
  }

  public async deleteById(id: string): Promise<boolean> {
    const { modifiedCount } = await this.model.deleteById(id);
    return modifiedCount === 1;
  }
}
