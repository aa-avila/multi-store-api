import { ApiProperty } from '@nestjs/swagger';

export class CreateProductResponseDto {
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  id: string;
}
