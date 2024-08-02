import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { CreateUserRequestDto } from './createUserRequest.dto';

export class CreateUserResponseDto extends CreateUserRequestDto {
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  _id: ObjectId;
}
