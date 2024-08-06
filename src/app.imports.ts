import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { TypegooseModule } from 'nestjs-typegoose';
import { LoggerConfig } from './core/config/logger.config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './core/bcrypt/bcript.module';
import { TypegooseConfig } from './core/config/typegoose.config';

export const AppImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'test', 'staging', 'production')
        .default('development'),
      PORT: Joi.number().default(3000),
      APP_PREFIX: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      LOGGER_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'debug', 'log', 'silent')
        .default('debug'),
      LOGGER_PRETTY_PRINT: Joi.boolean().default(false),
      MONGO_URL: Joi.string().required(),
    }),
  }),
  LoggerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => LoggerConfig(config),
  }),
  TypegooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => TypegooseConfig(config),
  }),
  HealthModule,
  AuthModule,
  UsersModule,
  CategoriesModule,
  ProductsModule,
  BcryptModule,
];
