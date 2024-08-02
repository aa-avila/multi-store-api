import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Sex } from '../../utils/enum/sex';

export class PetBasicDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Firulais' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Perro salchicha' })
  type: string;

  @IsOptional()
  @IsEnum(Sex, {
    // eslint-disable-next-line prefer-template
    message: 'Must be a valid enum value: ' + Object.values(Sex).join(','),
  })
  @ApiProperty({ example: 'male' })
  sex?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 17 })
  weight?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'negro y marron' })
  color?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2005-06-05' })
  birthday?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Le gusta jugar con la pelota' })
  notes?: string;
}
