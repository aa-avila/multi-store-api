import {
  Injectable,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { PaginateResult } from 'mongoose';
import { CompaniesRepository } from './companies.repository';
import { CompanyDoc } from './model/companies.schema';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { ICreateCompany } from './interfaces/ICreateCompany';
import { CreateDocResponse } from '../common/types/createDocResponse';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(CompaniesRepository)
    private readonly repository: CompaniesRepository,
    // private configService: ConfigService,
  ) {}

  async create(data: ICreateCompany): Promise<CreateDocResponse> {
    try {
      const response = await this.repository.create(data);
      return response;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Slug already exists', HttpStatus.CONFLICT);
      }
      throw new InternalServerErrorException(
        error.message || JSON.stringify(error),
      );
    }
  }

  public async getAll(
    queryFilters: IQueryParams,
  ): Promise<PaginateResult<CompanyDoc>> {
    return this.repository.getAll(queryFilters);
  }

  public async getById(id: ID): Promise<CompanyDoc> {
    const doc = await this.repository.getById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  async getBySlug(slug: string): Promise<CompanyDoc> {
    const doc = await this.repository.getBySlug(slug);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async updateById(
    id: string,
    updateData: Partial<ICreateCompany>,
  ): Promise<boolean> {
    const result = await this.repository.updateById(id, updateData);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.deleteById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
