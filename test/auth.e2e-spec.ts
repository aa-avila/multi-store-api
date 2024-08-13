import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '../src/common/filters/allException.filter';
import { ResponseWrapperInterceptor } from '../src/common/interceptors/responseWrapper.interceptor';
import { TimestampInterceptor } from '../src/common/interceptors/timestamp.interceptor';
import { AppModule } from '../src/app.module';
import { CreateUserRequestDto } from '../src/users/dto/createUserRequest.dto';
// import { jwtCreator } from './helpers';

const userCreateReq: CreateUserRequestDto = {
  email: 'test-auth@example.com',
  firstName: 'Pepe',
  lastName: 'Lopez',
  phoneNumber: '+54912345678',
};
const tokenTest = 'token1234'; // <== harcodeado en UsersService

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
    // let userId = '';
    const password = '123456788';

    it('create user', async () => {
      const {
        status,
        body: { data: createResponse },
      } = await request(app.getHttpServer()).post('/users').send(userCreateReq);
      expect(status).toBe(201);
      expect(createResponse.id).toBeDefined();
      // userId = createResponse.id;
    });

    it('new password', async () => {
      const newPasswordBodyData = {
        password,
        token: tokenTest,
      };

      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .post('/auth/new-password')
        .send(newPasswordBodyData);

      expect(status).toBe(201);
      expect(data).toBe(true);
    });

    it('new password - token not found', async () => {
      const newPasswordBodyData = {
        password,
        token: 'asdfasdf',
      };

      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .post('/auth/new-password')
        .send(newPasswordBodyData);

      expect(status).toBe(404);
      expect(error).toBeDefined();
    });

    it('signin', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ password, email: userCreateReq.email });
      expect(status).toBe(201);
      expect(data.email).toEqual(userCreateReq.email);
      expect(data.roles).toEqual(['customer']);
      expect(data.id).toBeDefined();
      expect(data.token).toBeDefined();
    });

    it('signin bad password', async () => {
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ password: '99999999', email: userCreateReq.email });
      expect(status).toBe(401);
      expect(error).toBeDefined();
    });

    it('reset password', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .patch('/auth/reset-password')
        .send({ email: userCreateReq.email });
      expect(status).toBe(200);
      expect(data).toBe(true);
    });

    it('reset password - email not found', async () => {
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .patch('/auth/reset-password')
        .send({ email: 'asdf@asdf.com' });
      expect(status).toBe(404);
      expect(error).toBeDefined();
    });
  });
});
