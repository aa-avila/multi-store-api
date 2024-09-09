import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  Min,
} from 'class-validator';

export class ProductBaseDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '66df4c3bea6769d32f59dac0' })
  companyId: string;

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

  @IsArray()
  @ApiProperty({
    isArray: true,
    example: [
      'https://firebasestorage.googleapis.com/v0/b/alcachofa-corazon.appspot.com/o/example%2Ftazas-ejemplo.jpg?alt=media&token=b82766d1-4805-468c-ad4c-99058caac359',
    ],
  })
  images: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 'Taza con diseño de nubes. Modelada y pintada a mano.',
  })
  price: number;
}
