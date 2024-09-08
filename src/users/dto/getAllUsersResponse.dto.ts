import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { GetUserResponseDto } from './getUserResponse.dto';

export class GetAllUsersResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: GetUserResponseDto })
  docs: GetUserResponseDto[];
}
