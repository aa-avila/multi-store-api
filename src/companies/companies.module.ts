import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Company } from './model/companies.model';

@Module({
  imports: [TypegooseModule.forFeature([Company])],
  providers: [CompaniesService, CompaniesRepository],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class UsersModule {}
