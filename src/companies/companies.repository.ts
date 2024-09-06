import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { CompanyDoc, CompanySchema } from './model/companies.schema';
import { Company } from './model/companies.model';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { mongoDocParser } from '../common/utils/mongoDocParser';

@Injectable()
export class CompaniesRepository {
  constructor(
    @InjectModel(Company)
    private readonly model: ReturnModelType<typeof Company>,
  ) {}

  private fromDbConverter(dbDoc: Company): CompanyDoc {
    return mongoDocParser<CompanySchema, CompanyDoc>(dbDoc);
  }

  public async create(data: CompanySchema): Promise<CreateDocResponse> {
    const response = await this.model.create(data);
    const { id } = this.fromDbConverter(response);
    return {
      id,
    };
  }

  public async getAll({
    page,
    limit,
    name,
  }: IQueryParams): Promise<PaginateResult<CompanyDoc>> {
    const filters: any = {};
    if (name) {
      filters.name = { $regex: name };
    }
    const result = await this.model.paginate(filters, {
      limit,
      page,
    });
    return {
      ...result,
      docs: result.docs.map((doc) => {
        return this.fromDbConverter(doc);
      }),
    };
  }

  public async getById(id: ID): Promise<CompanyDoc | undefined> {
    const doc = await this.model.findOne({ _id: id });
    if (!doc) {
      return undefined;
    }
    return this.fromDbConverter(doc);
  }

  public async getBySlug(slug: string): Promise<CompanyDoc | undefined> {
    const doc = await this.model.findOne({ slug });
    if (!doc) {
      return undefined;
    }
    return this.fromDbConverter(doc);
  }

  public async updateById(
    id: string,
    data: Partial<CompanySchema>,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne({ _id: id }, data);
    return modifiedCount === 1;
  }

  public async deleteById(id: string): Promise<boolean> {
    const { modifiedCount } = await this.model.deleteById(id);
    return modifiedCount === 1;
  }
}
