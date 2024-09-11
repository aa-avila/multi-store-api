import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { StorefrontService } from './storefront.service';
import { StorefrontController } from './storefront.controller';
import { PromotionsService } from '../promotions/promotions.service';
import { CompaniesService } from '../companies/companies.service';
import { PromotionsRepository } from '../promotions/promotions.repository';
import { CompaniesRepository } from '../companies/companies.repository';
import { Promotion } from '../promotions/model/promotions.model';
import { Company } from '../companies/model/companies.model';

@Module({
  imports: [
    TypegooseModule.forFeature([Promotion]),
    TypegooseModule.forFeature([Company]),
  ],
  controllers: [StorefrontController],
  providers: [
    StorefrontService,
    PromotionsService,
    CompaniesService,
    PromotionsRepository,
    CompaniesRepository,
  ],
})
export class StorefrontModule {}
