import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { CategoryBasicDto } from './categoryBasic.dto';

export class CreateCategoryResponseDto extends CategoryBasicDto {
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  _id: ObjectId;
}
