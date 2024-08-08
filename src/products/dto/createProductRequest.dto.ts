import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { ProductBasicDto } from './productBasic.dto';

export class CreateProductRequestDto extends ProductBasicDto {
  @IsMongoId()
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  category: string;
}
