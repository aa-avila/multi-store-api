import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { GetProductResponseDto } from './getProductResponse.dto';

export class GetAllProductsResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: GetProductResponseDto })
  docs: GetProductResponseDto[];
}
