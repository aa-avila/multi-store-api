import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { GetCompanyResponseDto } from './getCompanyResponse.dto';

export class GetAllCompaniesResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: GetCompanyResponseDto })
  docs: GetCompanyResponseDto[];
}
