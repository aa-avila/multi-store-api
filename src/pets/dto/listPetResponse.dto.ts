import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../utils/dto/pagination.dto';
import { CreatePetResponseDto } from './createPetResponse.dto';

export class ListPetResponseDto extends PaginationDto {
  @ApiProperty({ isArray: true, type: CreatePetResponseDto })
  docs: CreatePetResponseDto[];
}
