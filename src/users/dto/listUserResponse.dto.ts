import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreateUserResponseDto } from './createUserResponse.dto';

export class ListUserResponseDto {
  @ApiProperty({ isArray: true, type: CreateUserResponseDto })
  docs: CreateUserResponseDto[];

  @ApiProperty({ type: PaginationDto })
  meta: PaginationDto;
}
