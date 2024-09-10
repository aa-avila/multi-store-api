import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { UserBaseDto } from './userBase.dto';
import { Role } from '../../common/enums/role.enum';

export class CreateUserRequestDto extends UserBaseDto {
  @IsArray()
  @IsEnum(Role, { each: true })
  @ApiProperty({ example: ['super_admin'] })
  roles: Role[];
}
