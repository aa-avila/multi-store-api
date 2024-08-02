import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { Pet } from './pets.model';

@Module({
  imports: [TypegooseModule.forFeature([Pet])],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
