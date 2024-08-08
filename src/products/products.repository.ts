import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateProductRequestDto } from './dto/updateProductRequest.dto';
import { IQueryFilters } from './interfaces/IQueryFilters';
import { Product } from './products.model';
import { CreateDocResponse } from '../core/types/createDocResponse';
import { ProductDoc, ProductSchema } from './products.schema';
import { PaginateResult } from 'mongoose';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product)
    private readonly productModel: ReturnModelType<typeof Product>,
  ) {}

  public async create(data: ProductSchema): Promise<CreateDocResponse> {
    const response = await this.productModel.create(data);
    return { id: response._id.toString() };
  }

  public async getAll({
    page,
    limit,
    name,
  }: IQueryFilters): Promise<PaginateResult<ProductDoc>> {
    const filters: any = {};
    if (name) {
      filters.name = { $regex: name };
    }
    const result = await this.productModel.paginate(filters, {
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

  public async getById(_id: string): Promise<ProductDoc | undefined> {
    const doc = await this.productModel.findOne({ _id });
    // .populate<{ category: Category }>('category', { _id: 1, name: 1 });
    if (!doc) {
      return undefined;
    }
    const { _id: mongoId, ...rest } = doc;
    return {
      id: mongoId.toString(),
      ...rest,
    };
  }

  public async update(
    _id: string,
    productData: UpdateProductRequestDto,
  ): Promise<boolean> {
    const { modifiedCount } = await this.productModel.updateOne(
      { _id },
      productData,
    );

    return modifiedCount === 1;
  }

  public async delete(_id: string): Promise<boolean> {
    const { modifiedCount } = await this.productModel.deleteById(_id);
    return modifiedCount === 1;
  }
}
