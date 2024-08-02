import { OmitType } from '@nestjs/swagger';
import { CreateUserResponseDto } from './createUserResponse.dto';

export class UpdateUserRequestDto extends OmitType(CreateUserResponseDto, [
  '_id',
] as const) {}
