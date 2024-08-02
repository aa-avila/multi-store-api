import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ItemsController } from './items.controller';

import { Item } from './items.model';
import { ItemsService } from './items.service';

@Module({
  imports: [TypegooseModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
