import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { User } from 'src/users/users.model';
import { Ref } from '@typegoose/typegoose';
import { PetBasicDto } from './petBasic.dto';

export class CreatePetResponseDto extends PetBasicDto {
  @ApiProperty({ example: '61d433863260b40e79f87db1' })
  _id: ObjectId;

  @ApiProperty({ example: ['61d433863260b40e79f87db1'] })
  owners: Ref<User, string>[];
}
