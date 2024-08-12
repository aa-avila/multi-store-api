import { OmitType } from '@nestjs/swagger';
import { CreateUserResponseDto } from './createUserResponse.dto';

export class UpdateUserRequestDto extends OmitType(CreateUserResponseDto, [
  'id',
] as const) {}
