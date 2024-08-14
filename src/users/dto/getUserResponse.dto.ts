import { ApiProperty } from '@nestjs/swagger';
import { UserBaseDto } from './userBase.dto';
import { Role } from '../../common/enums/role.enum';

export class GetUserResponseDto extends UserBaseDto {
  @ApiProperty({
    isArray: true,
    example: [Role.COMPANY_ADMIN],
  })
  roles: Role[];
}
