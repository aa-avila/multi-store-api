import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateProductResponseDto } from './createProductResponse.dto';

export class GetAllProductsResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: CreateProductResponseDto })
  docs: CreateProductResponseDto[];
}
