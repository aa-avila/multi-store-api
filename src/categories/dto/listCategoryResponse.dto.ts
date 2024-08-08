import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateCategoryResponseDto } from './createCategoryResponse.dto';

export class ListCategoryResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: CreateCategoryResponseDto })
  docs: CreateCategoryResponseDto[];
}
