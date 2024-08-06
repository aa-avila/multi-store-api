import {
  Controller,
  Request,
  UseGuards,
  Post,
  HttpStatus,
  Body,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { apiResponseWrapper } from '../core/factories/apiResponseWrapper.factory';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { NewPasswordRequestDto } from './dto/newPasswordRequest.dto';
import { apiErrorWrapper } from '../core/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../core/dto/error.dto';
import { ResetPasswordRequestDto } from './dto/resetPasswordRequest.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Login users',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(LoginResponseDto),
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Unauthorized',
  })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @Post('signin')
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'New Password',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(Boolean),
    description: 'Created password',
  })
  @Post('new-password')
  async newPassword(
    @Body() newPasswordData: NewPasswordRequestDto,
  ): Promise<boolean> {
    return this.authService.newPassword(newPasswordData);
  }

  @ApiOperation({
    summary: 'Reset Password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(Boolean),
    description: 'Created reset password token',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiResponseWrapper(ErrorResponseDto),
    description: 'email must be an email',
  })
  @Patch('reset-password')
  async resetPassword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<boolean> {
    return this.authService.resetPassword(resetPasswordRequestDto);
  }
}
