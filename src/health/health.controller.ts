import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';
import { HealthService } from './health.service';
import { HealthDto } from './health.dto';
import { Auth } from '../auth/auth.decorador';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @ApiOperation({
    summary: 'Health',
    description: 'Endpoint displaying information about the microservice',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: apiResponseWrapper(HealthDto),
    description: 'Ok',
  })
  @Auth()
  @Get('/health')
  getHealthCheck(): HealthDto {
    return this.healthService.getHealthCheck();
  }
}
