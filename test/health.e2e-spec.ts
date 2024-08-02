import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ResponseWrapperInterceptor } from '../src/utils/interceptors/responseWrapper.interceptor';
import { TimestampInterceptor } from '../src/utils/interceptors/timestamp.interceptor';
import { AllExceptionsFilter } from '../src/utils/filters/allException.filter';
import { AppModule } from '../src/app.module';
import { jwtCreator } from './helpers';

describe('Health Module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleTest: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleTest.createNestApplication();

    const logger = app.get<Logger>(Logger);
    const config = app.get<ConfigService>(ConfigService);
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalFilters(new AllExceptionsFilter(logger, config));
    app.useGlobalInterceptors(
      new TimestampInterceptor(),
      new ResponseWrapperInterceptor(),
    );

    await app.init();
  });

  afterEach(async () => app.close());

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it('/ (GET)', async () => {
    const {
      status,
      body: { data },
    } = await request(app.getHttpServer()).get('/');
    expect(status).toBe(200);
    expect(data).toBe('Ok!');
  });

  it('/health (GET)', async () => {
    const user = {
      email: 'test@test.com',
      roles: ['admin'],
      _id: '61d43f8d5d7b9a0a7adcba4a',
      firstName: 'juan',
    };
    const jwt = await jwtCreator(user);

    const {
      status,
      body: { data },
    } = await request(app.getHttpServer())
      .get('/health')
      .set('Authorization', `Bearer ${jwt}`);

    expect(status).toBe(200);
    expect(data.environment).toBe('test');
  });
});
