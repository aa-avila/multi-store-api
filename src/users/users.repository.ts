import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { PaginateResult } from 'mongoose';
import { ID } from '../common/types/id';
import { IQueryParams } from './interfaces/IQueryParams';
import { UserDoc, UserSchema } from './model/users.schema';
import { User } from './model/users.model';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { mongoCreateDocResponseParser } from '../common/utils/mongoCreateDocResponseParser';
import { mongoDocResponseParser } from '../common/utils/mongoDocResponseParser';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User)
    private readonly model: ReturnModelType<typeof User>,
  ) {}

  public async createUser(data: UserSchema): Promise<CreateDocResponse> {
    const response = await this.model.create(data);
    return mongoCreateDocResponseParser(response);
  }

  public async getAll({
    page,
    limit,
    email,
    companyId,
  }: IQueryParams): Promise<PaginateResult<UserDoc>> {
    const filters: any = {};
    if (email) {
      filters.email = { $regex: email };
    }
    if (companyId) {
      filters.companyId = companyId;
    }
    const result = await this.model.paginate(filters, {
      limit,
      page,
    });
    return {
      ...result,
      docs: result.docs.map((doc) => {
        return mongoDocResponseParser<UserDoc>(doc);
      }),
    };
  }

  public async getById(id: ID): Promise<UserDoc | undefined> {
    const doc = await this.model.findOne({ _id: id });
    if (!doc) {
      return undefined;
    }
    return mongoDocResponseParser<UserDoc>(doc);
  }

  public async getByEmail(email: string): Promise<UserDoc | undefined> {
    const doc = await this.model.findOne({ email });
    if (!doc) {
      return undefined;
    }
    const { _id: mongoId, ...rest } = doc;
    return {
      id: mongoId.toString(),
      ...rest,
    };
  }

  public async updateById(
    id: string,
    data: Partial<UserSchema>,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne({ _id: id }, data);
    return modifiedCount === 1;
  }

  public async setPasswordByToken(
    token: string,
    passwordHash: string,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne(
      {
        token,
      },
      { password: passwordHash },
    );
    return modifiedCount === 1;
  }

  public async setTokenByEmail(email: string, token: string): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne(
      {
        email,
      },
      { token },
    );
    return modifiedCount === 1;
  }

  public async deleteById(id: string): Promise<boolean> {
    const { modifiedCount } = await this.model.deleteById(id);
    return modifiedCount === 1;
  }

  async count(): Promise<number> {
    const total = await this.model.estimatedDocumentCount();
    return total;
  }
}
