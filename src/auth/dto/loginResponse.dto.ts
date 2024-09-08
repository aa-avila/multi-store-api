import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';
import { ID } from '../../common/types/id';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  id: ID;

  @ApiProperty({ example: 'test@example.com.cl' })
  email: string;

  @ApiProperty({ enum: Role, isArray: true })
  roles: Role[];
}
