import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { apiErrorWrapper } from '../core/factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../core/dto/error.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';

export function Auth(): any {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      type: apiErrorWrapper(ErrorResponseDto),
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      type: apiErrorWrapper(ErrorResponseDto),
      description: 'Forbidden',
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      type: apiErrorWrapper(ErrorResponseDto),
      description: 'Internal server error',
    }),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
  );
}
