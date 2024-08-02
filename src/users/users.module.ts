import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { BcryptModule } from '../bcrypt/bcript.module';

@Module({
  imports: [BcryptModule, TypegooseModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
