import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { PromotionDoc, PromotionSchema } from './model/promotions.schema';
import { Promotion } from './model/promotions.model';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { mongoDocParser } from '../common/utils/mongoDocParser';
import {
  ProductCategoryDoc,
  ProductCategorySchema,
} from '../productCategories/model/productCategories.schema';

@Injectable()
export class PromotionsRepository {
  constructor(
    @InjectModel(Promotion)
    private readonly model: ReturnModelType<typeof Promotion>,
  ) {}

  private fromDbConverter(
    dbDoc: Promotion,
    isPopulated?: boolean,
  ): PromotionDoc {
    const doc = mongoDocParser<PromotionSchema, PromotionDoc>(dbDoc);
    const { categories } = doc;
    if (isPopulated) {
      if (categories?.length) {
        doc.categories = categories.map((category) => {
          return mongoDocParser<ProductCategorySchema, ProductCategoryDoc>(
            category,
          );
        });
      }
    }
    return doc;
  }

  public async create(data: PromotionSchema): Promise<CreateDocResponse> {
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
  }: IQueryParams): Promise<PaginateResult<PromotionDoc>> {
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
      populate: {
        path: 'categories',
        select: { _id: 1, name: 1, description: 1, image: 1 },
      },
    });
    return {
      ...result,
      docs: result.docs.map((doc) => {
        return this.fromDbConverter(doc, true);
      }),
    };
  }

  public async getById(id: ID): Promise<PromotionDoc | undefined> {
    const doc = await this.model
      .findOne({ _id: id })
      .populate('categories', { _id: 1, name: 1, description: 1, image: 1 });

    if (!doc) {
      return undefined;
    }
    return this.fromDbConverter(doc, true);
  }

  public async getByIdAndCompanyId(
    id: ID,
    companyId: ID,
  ): Promise<PromotionDoc | undefined> {
    const doc = await this.model
      .findOne({ _id: id, companyId })
      .populate('categories', { _id: 1, name: 1, description: 1, image: 1 });

    if (!doc) {
      return undefined;
    }
    return this.fromDbConverter(doc, true);
  }

  public async updateById(
    id: string,
    data: Partial<PromotionSchema>,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne({ _id: id }, data);
    return modifiedCount === 1;
  }

  public async deleteById(id: string): Promise<boolean> {
    const { modifiedCount } = await this.model.deleteById(id);
    return modifiedCount === 1;
  }
}
