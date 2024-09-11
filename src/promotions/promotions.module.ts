import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PromotionsRepository } from './promotions.repository';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { Promotion } from './model/promotions.model';

@Module({
  imports: [TypegooseModule.forFeature([Promotion])],
  controllers: [PromotionsController],
  providers: [PromotionsService, PromotionsRepository],
  // exports: [PromotionsService],
})
export class PromotionsModule {}
