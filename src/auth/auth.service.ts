import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { Bcrypt } from '../common/bcrypt/bcrypt.provider';
import { CreateUserResponseDto } from '../users/dto/createUserResponse.dto';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { NewPasswordRequestDto } from './dto/newPasswordRequest.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(BCRYPT) public bcryptProvider: Bcrypt,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<CreateUserResponseDto> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      user.password &&
      this.bcryptProvider.compareSync(password, user.password)
    ) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<any> {
    const payload = { email: user.email, _id: user._id, roles: user.roles };
    return { ...payload, token: this.jwtService.sign(payload) };
  }

  newPassword(newPasswordData: NewPasswordRequestDto): Promise<boolean> {
    return this.usersService.newPassword(newPasswordData);
  }

  async resetPassword(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<boolean> {
    return this.usersService.resetPassword(resetPasswordRequestDto);
  }
}
