import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './products.model';

@Module({
  imports: [TypegooseModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
