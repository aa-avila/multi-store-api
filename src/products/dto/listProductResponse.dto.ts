import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../utils/dto/pagination.dto';
import { CreateProductResponseDto } from './createProductResponse.dto';

export class ListProductResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: CreateProductResponseDto })
  docs: CreateProductResponseDto[];
}
