import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ResetPasswordRequestDto } from 'src/auth/dto/resetPasswordRequest.dto';
import { User } from './model/users.model';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { Bcrypt } from '../common/bcrypt/bcrypt.provider';
import { Role } from '../common/enums/role.enum';
import { CreateUserRequestDto } from './dto/createUserRequest.dto';

@Injectable()
export class UsersService {
  saltRounds = 10;

  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    @Inject(BCRYPT) public bcryptProvider: Bcrypt,
  ) {}

  async create(user: CreateUserRequestDto): Promise<DocumentType<User>> {
    try {
      const userHash: Partial<User> = { ...user };

      userHash.token = this.generateToken();
      userHash.roles = [Role.CUSTOMER];
      const newUser = await this.userModel.create(userHash);

      return newUser;
    } catch (error) {
      if (error.code === 11000)
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);

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
    const { modifiedCount } = await this.userModel.updateOne(
      {
        token,
      },
      { password: this.generatePassword(password) },
    );

    return !!modifiedCount;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findOne(_id: string): Promise<DocumentType<User>> {
    const response = await this.userModel.findOne({ _id });
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  generateToken(): string {
    return `${this.bcryptProvider.genSaltSync()}`;
  }

  generatePassword(password: string): string {
    return this.bcryptProvider.hashSync(password, this.saltRounds);
  }

  async count(): Promise<number> {
    const total = await this.userModel.estimatedDocumentCount();
    return total;
  }

  async resetPassword({ email }: ResetPasswordRequestDto): Promise<boolean> {
    const { modifiedCount } = await this.userModel.updateOne(
      {
        email,
      },
      { token: this.generateToken() },
    );
    /// TODO send token by email

    return !!modifiedCount;
  }
}
