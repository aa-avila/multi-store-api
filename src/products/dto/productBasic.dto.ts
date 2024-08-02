import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductBasicDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Taza nubes' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Taza con diseño de nubes. Modelada y pintada a mano.',
  })
  description: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    example: [
      'https://firebasestorage.googleapis.com/v0/b/alcachofa-corazon.appspot.com/o/example%2Ftazas-ejemplo.jpg?alt=media&token=b82766d1-4805-468c-ad4c-99058caac359',
    ],
  })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  display?: boolean;
}
