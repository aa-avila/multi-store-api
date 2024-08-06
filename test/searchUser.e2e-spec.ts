import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '../src/core/filters/allException.filter';
import { ResponseWrapperInterceptor } from '../src/core/interceptors/responseWrapper.interceptor';
import { TimestampInterceptor } from '../src/core/interceptors/timestamp.interceptor';
import { AppModule } from '../src/app.module';
import { jwtCreator } from './helpers';

describe('Serch User Module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleTest: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleTest.createNestApplication();

    const logger = app.get<Logger>(Logger);
    const config = app.get<ConfigService>(ConfigService);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
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

  describe('users flow', () => {
    let jwt: string;
    let user: any = {
      email: 'test1@b21.com',
      firstName: 'string1',
      lastName: 'string1',
      token: null,
      role: [],
    };

    it('create user', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer()).post('/users').send(user);
      expect(status).toBe(201);
      expect(data.firstName).toEqual(user.firstName);
      expect(data.lastName).toEqual(user.lastName);
      expect(data.email).toEqual(user.email);
      expect(data.roles).toEqual(['other']);
      expect(data._id).toBeDefined();
      user = data;
    });

    it('serch User like admin', async () => {
      jwt = await jwtCreator(user);
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .get(`/users/${user._id}`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(status).toBe(200);
      expect(data._id).toBe(user._id);
      expect(data.firstName).toEqual(user.firstName);
      expect(data.email).toEqual(user.email);
    });

    it('serch user like admin bad request', async () => {
      jwt = await jwtCreator(user);
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .get(`/users/ñ{ñ{ñ{}}}`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(status).toBe(400);
      expect(error).toBeDefined();
    });

    it('serch user like admin not found', async () => {
      jwt = await jwtCreator(user);
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .get(`/users/5d7b9a0a7adcba4a`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(status).toBe(400);
      expect(error).toBeDefined();
    });
  });
});
