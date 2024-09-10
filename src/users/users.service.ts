import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginateResult } from 'mongoose';
import { UsersRepository } from './users.repository';
import { ResetPasswordRequestDto } from '../auth/dto/resetPasswordRequest.dto';
import { UserDoc, UserSchema } from './model/users.schema';
import { ID } from '../common/types/id';
import { ICreateUser } from './interfaces/ICreateUser';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { Bcrypt } from '../common/bcrypt/bcrypt.provider';
import { Role } from '../common/enums/role.enum';
import { IQueryParams } from './interfaces/IQueryParams';

@Injectable()
export class UsersService {
  saltRounds = 10;

  constructor(
    @Inject(UsersRepository)
    private readonly repository: UsersRepository,
    @Inject(BCRYPT)
    public bcryptProvider: Bcrypt,
    private configService: ConfigService,
  ) {}

  generateToken(): string {
    const env = this.configService.get('NODE_ENV');
    if (env === 'test' || env === 'development') {
      return 'token1234';
    }
    return `${this.bcryptProvider.genSaltSync()}`;
  }

  // TODO: change name to encriptPassword
  generatePassword(password: string): string {
    return this.bcryptProvider.hashSync(password, this.saltRounds);
  }

  async create(user: ICreateUser): Promise<CreateDocResponse> {
    try {
      const token = this.generateToken();
      const roles = user.roles?.length > 0 ? user.roles : [Role.CUSTOMER]; // sets default role if not sent in request
      const userPartial: UserSchema = { ...user, token, roles };
      const response = await this.repository.createUser(userPartial);
      // TODO: send token by email
      return response;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new InternalServerErrorException(
        error.message || JSON.stringify(error),
      );
    }
  }

  public async getAll(
    queryFilters: IQueryParams,
  ): Promise<PaginateResult<UserDoc>> {
    const response = await this.repository.getAll(queryFilters);
    const sanitizedResponse = {
      ...response,
      docs: response.docs.map((doc) => {
        doc.password && delete doc.password;
        doc.token && delete doc.token;
        return doc;
      }),
    };
    return sanitizedResponse;
  }

  public async getById(id: ID): Promise<UserDoc> {
    const doc = await this.repository.getById(id);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  async getByEmail(email: string): Promise<UserDoc> {
    const doc = await this.repository.getByEmail(email);
    if (!doc) {
      throw new NotFoundException();
    }
    return doc;
  }

  public async updateById(
    id: string,
    updateData: Partial<ICreateUser>,
  ): Promise<boolean> {
    const result = await this.repository.updateById(id, updateData);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  // TODO: change name to setNewPassword
  async newPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }): Promise<boolean> {
    const passwordHash = this.generatePassword(password);
    const result = await this.repository.setPasswordByToken(
      token,
      passwordHash,
    );
    if (!result) {
      throw new NotFoundException();
    }
    // TODO: send email notification
    return result;
  }

  async resetPassword({ email }: ResetPasswordRequestDto): Promise<boolean> {
    const token = this.generateToken();
    const result = await this.repository.setTokenByEmail(email, token);
    if (!result) {
      throw new NotFoundException();
    }
    // TODO: send token by email
    return result;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.deleteById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
