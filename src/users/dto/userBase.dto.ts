import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserBaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'juanperez@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Juan' })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Perez',
  })
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '+54912345678' })
  phoneNumber?: string;

  // TODO: company
}
