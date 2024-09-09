import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductCategoriesRepository } from './productCategories.repository';
import { ProductCategoriesService } from './productCategories.service';
import { ProductCategoriesController } from './productCategories.controller';
import { ProductCategory } from './model/productCategories.model';

@Module({
  imports: [TypegooseModule.forFeature([ProductCategory])],
  providers: [ProductCategoriesService, ProductCategoriesRepository],
  controllers: [ProductCategoriesController],
  exports: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
