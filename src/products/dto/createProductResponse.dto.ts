import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Ref } from '@typegoose/typegoose';
import { Category } from 'src/categories/categories.model';
import { ProductBasicDto } from './productBasic.dto';

export class CreateProductResponseDto extends ProductBasicDto {
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  _id: ObjectId;

  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  category: Ref<Category, string>;
}
