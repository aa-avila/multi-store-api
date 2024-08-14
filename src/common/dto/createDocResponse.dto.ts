import { ApiProperty } from '@nestjs/swagger';
import { ID } from '../../common/types/id';

export class CreateDocResponseDto {
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  id: ID;
}
