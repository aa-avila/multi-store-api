import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PromotionsRepository } from './promotions.repository';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { ICreatePromotion } from './interfaces/ICreatePromotion';
import { PromotionDoc } from './model/promotions.schema';

@Injectable()
export class PromotionsService {
  constructor(
    @Inject(PromotionsRepository)
    private readonly repository: PromotionsRepository,
  ) {}

  public async create(data: ICreatePromotion): Promise<CreateDocResponse> {
    const response = await this.repository.create(data);
    return response;
  }

  public async getAll(
    queryFilters: IQueryParams,
  ): Promise<PaginateResult<PromotionDoc>> {
    return this.repository.getAll(queryFilters);
  }

  public async getById(id: ID): Promise<PromotionDoc> {
    const doc = await this.repository.getById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async updateById(
    id: string,
    productData: Partial<ICreatePromotion>,
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
