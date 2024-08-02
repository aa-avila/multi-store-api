import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { CreateItemRequestDto } from './createItemRequest.dto';

export class CreateItemResponseDto extends CreateItemRequestDto {
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  _id: ObjectId;
}
