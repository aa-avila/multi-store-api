import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserBaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'juanperez@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Perez',
  })
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '+54912345678' })
  phoneNumber?: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: '66df4c3bea6769d32f59dac0' })
  companyId?: string;
}
