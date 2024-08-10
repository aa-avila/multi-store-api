import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { ProductDoc, ProductSchema } from './model/products.schema';
import { Product } from './model/products.model';
import { CreateDocResponse } from '../common/types/createDocResponse';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product)
    private readonly model: ReturnModelType<typeof Product>,
  ) {}

  public async create(data: ProductSchema): Promise<CreateDocResponse> {
    const response = await this.model.create(data);
    return { id: response._id.toString() };
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
      populate: { path: 'category', select: { _id: 1, name: 1 } },
    });
    return {
      ...result,
      docs: result.docs.map((doc) => {
        const { _id, ...rest } = doc;
        return { id: _id.toString(), ...rest };
      }),
    };
  }

  public async getById(id: ID): Promise<ProductDoc | undefined> {
    const doc = await this.model
      .findOne({ _id: id })
      .populate('category', { _id: 1, name: 1 });
    if (!doc) {
      return undefined;
    }
    const { _id: mongoId, ...rest } = doc;
    return {
      id: mongoId.toString(),
      ...rest,
    };
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
