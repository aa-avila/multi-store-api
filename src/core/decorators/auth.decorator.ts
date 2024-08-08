import { applyDecorators, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { apiErrorWrapper } from '../factories/apiErrorWrapper.factory';
import { ErrorResponseDto } from '../dto/error.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/role.guard';

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
