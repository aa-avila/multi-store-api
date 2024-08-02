import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export const LoggerConfig = (config: ConfigService): Params => ({
  exclude: [{ method: RequestMethod.GET, path: config.get('APP_PREFIX') }],
  pinoHttp: {
    redact: {
      paths: [],
      censor: '********',
    },
    name: config.get('npm_package_name'),
    level: config.get('LOGGER_LEVEL'),
    transport: {
      target: 'pino-pretty',
    },
  },
});
