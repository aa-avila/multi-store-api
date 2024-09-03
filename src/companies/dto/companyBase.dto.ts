import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CompanyBaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'the-company' })
  slug: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'The Company',
  })
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '66d65c368cecec2ee70700be' })
  ownerId: string;
}
