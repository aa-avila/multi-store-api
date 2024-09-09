import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { GetPromotionResponseDto } from './getPromotionResponse.dto';

export class GetAllProductsResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: GetPromotionResponseDto })
  docs: GetPromotionResponseDto[];
}
