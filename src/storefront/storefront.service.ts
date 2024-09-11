import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IPaginationQueryParams } from '../common/interfaces/IPaginationQueryParams';
import { PromotionsService } from '../promotions/promotions.service';
import { PromotionDoc } from '../promotions/model/promotions.schema';
import { CompaniesService } from '../companies/companies.service';
import { sanitizePromotion } from './utils/docSanitizers';

@Injectable()
export class StorefrontService {
  constructor(
    @Inject(CompaniesService)
    private readonly companiesService: CompaniesService,
    @Inject(PromotionsService)
    private readonly promotionsService: PromotionsService,
  ) {}

  public async getAllPromotionsByCompanySlug(
    companySlug: string,
    queryFilters: IPaginationQueryParams,
  ): Promise<PaginateResult<PromotionDoc>> {
    const company = await this.companiesService.getBySlug(companySlug);
    if (!company) {
      throw new NotFoundException('The company does not exist');
    }
    return this.promotionsService.getAll({
      ...queryFilters,
      companyId: company.id,
    });
  }

  public async getPromotionById(id: ID): Promise<PromotionDoc> {
    const promotion = await this.promotionsService.getById(id);
    return sanitizePromotion(promotion);
  }
}
