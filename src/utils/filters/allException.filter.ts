import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ErrorResponseDto } from '../errors/error.dto';
// import { parse } from 'error-stack-parser';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private logger: Logger,
    private config: ConfigService,
  ) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const code =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { status }: any =
      exception instanceof HttpException && exception.getResponse();

    const errorResponse: ErrorResponseDto = {
      code,
      status,
      message:
        code !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message.error ||
            exception.response.message ||
            exception.message
          : `Internal server error: ${exception.message}`,
      details: null,
      // TODO: fix this ==> this.config.get('NODE_ENV') !== 'production' ? parse(exception) : null,
    };

    this.logger.error(exception);
    this.logger.error(response);
    this.logger.error(request);

    response.status(code).json({ error: errorResponse });
  }
}
