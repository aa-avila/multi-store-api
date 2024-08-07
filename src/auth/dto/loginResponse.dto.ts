import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Role } from '../../core/auth/role.enum';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  _id: ObjectId;

  @ApiProperty({ example: 'test@b21.com.cl' })
  email: string;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];
}
