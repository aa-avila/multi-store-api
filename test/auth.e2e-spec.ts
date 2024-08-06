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

describe('Auth Module (e2e)', () => {
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

  describe('auth flow', () => {
    let user: any = {
      email: 'test@b21.com',
      firstName: 'string',
      lastName: 'string',
      token: null,
      role: [],
    };

    const password = '123456788';

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

    it('new password', async () => {
      const newPassword = {
        password,
        token: user.token,
      };

      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .post('/auth/new-password')
        .send(newPassword);

      expect(status).toBe(201);
      expect(data).toBe(true);
    });

    it('signin', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ password, email: user.email });
      expect(status).toBe(201);
      expect(data.email).toEqual(user.email);
      expect(data.roles).toEqual(['other']);
      expect(data._id).toBeDefined();
      expect(data.token).toBeDefined();
    });

    it('signin bad password', async () => {
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ password: '123456789', email: user.email });
      expect(status).toBe(401);
      expect(error).toBeDefined();
    });

    it('reset password', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .patch('/auth/reset-password')
        .send({ email: user.email });
      expect(status).toBe(200);
      expect(data).toBe(true);
      expect(user.token).toBeDefined();
    });
  });
});
