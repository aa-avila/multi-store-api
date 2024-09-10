import { PartialType } from '@nestjs/swagger';
import { CreateUserRequestDto } from '../dto/createUserRequest.dto';

export class UpdateUserRequestDto extends PartialType(CreateUserRequestDto) {}
