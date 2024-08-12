import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { ResetPasswordRequestDto } from '../auth/dto/resetPasswordRequest.dto';
import { UserDoc, UserSchema } from './model/users.schema';
import { ID } from '../common/types/id';
import { ICreateUser } from './interfaces/ICreateUser';
import { CreateDocResponse } from '../common/types/createDocResponse';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { Bcrypt } from '../common/bcrypt/bcrypt.provider';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  saltRounds = 10;

  constructor(
    @Inject(UsersRepository)
    private readonly repository: UsersRepository,
    @Inject(BCRYPT)
    public bcryptProvider: Bcrypt,
  ) {}

  generateToken(): string {
    return `${this.bcryptProvider.genSaltSync()}`;
  }

  generatePassword(password: string): string {
    return this.bcryptProvider.hashSync(password, this.saltRounds);
  }

  async create(user: ICreateUser): Promise<CreateDocResponse> {
    try {
      const token = this.generateToken();
      const roles = [Role.CUSTOMER];
      const userPartial: UserSchema = { ...user, token, roles };
      const response = await this.repository.createUser(userPartial);
      // TODO: send token by email
      return response;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new InternalServerErrorException(error);
    }
  }

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

  async count(): Promise<number> {
    return this.repository.count();
  }
}
