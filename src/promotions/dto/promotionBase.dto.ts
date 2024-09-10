import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsNumber,
  Min,
  IsUrl,
} from 'class-validator';

export class PromotionBaseDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '66df4c3bea6769d32f59dac0' })
  companyId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2x1 Super Tazon' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Solo por esta semana paga 1 y llevate 2 super tazones!',
  })
  description: string;

  @IsArray()
  @IsUrl({}, { each: true })
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
    example: 150000,
    description: 'Price in cents. Example: $1500.00 -> 150000',
  })
  price: number;
}
