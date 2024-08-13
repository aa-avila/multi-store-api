import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@example.com.cl' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Perez' })
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '+54912345678' })
  phoneNumber?: string;
}
