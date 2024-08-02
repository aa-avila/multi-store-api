import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../utils/dto/pagination.dto';
import { CreateItemResponseDto } from './createItemResponse.dto';

export class ListItemResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: CreateItemResponseDto })
  docs: CreateItemResponseDto[];
}
