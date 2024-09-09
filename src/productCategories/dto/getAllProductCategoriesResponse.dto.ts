import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { GetProductCategoryResponseDto } from './getProductCategoryResponse.dto';

export class GetAllProductCategoriesResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: GetProductCategoryResponseDto })
  docs: GetProductCategoryResponseDto[];
}
