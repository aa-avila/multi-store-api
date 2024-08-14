import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateDocResponseDto } from '../../common/dto/createDocResponse.dto';

export class GetAllProductsResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: CreateDocResponseDto })
  docs: CreateDocResponseDto[];
}
