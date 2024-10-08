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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { apiResponseWrapper } from '../common/factories/apiResponseWrapper.factory';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { NewPasswordRequestDto } from './dto/newPasswordRequest.dto';
import { apiErrorWrapper } from '../common/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../common/dto/error.dto';
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
  })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequestDto })
  @Post('login')
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Bad request',
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
