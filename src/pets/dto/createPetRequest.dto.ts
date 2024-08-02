import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, ArrayMinSize, IsMongoId } from 'class-validator';
import { PetBasicDto } from './petBasic.dto';

export class CreatePetRequestDto extends PetBasicDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  @ApiProperty({ example: ['61d433863260b40e79f87db1'] })
  owners?: string[];
}
