import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BCRYPT } from '../common/bcrypt/bcrypt.const';
import { Bcrypt } from '../common/bcrypt/bcrypt.provider';
import { UsersService } from '../users/users.service';
import { NewPasswordRequestDto } from './dto/newPasswordRequest.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';
import { UserDoc } from '../users/model/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(BCRYPT) public bcryptProvider: Bcrypt,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDoc> {
    const user = await this.usersService.getByEmail(email);
    if (
      user &&
      user.password &&
      this.bcryptProvider.compareSync(password, user.password)
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserDoc): Promise<any> {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return { ...payload, token: this.jwtService.sign(payload) };
  }

  async newPassword(newPasswordData: NewPasswordRequestDto): Promise<boolean> {
    return this.usersService.newPassword(newPasswordData);
  }

  async resetPassword(
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<boolean> {
    return this.usersService.resetPassword(resetPasswordRequestDto);
  }
}
