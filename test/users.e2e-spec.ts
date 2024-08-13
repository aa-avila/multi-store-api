import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '../src/common/filters/allException.filter';
import { ResponseWrapperInterceptor } from '../src/common/interceptors/responseWrapper.interceptor';
import { TimestampInterceptor } from '../src/common/interceptors/timestamp.interceptor';
import { AppModule } from '../src/app.module';
import { jwtCreator } from './helpers';
import { CreateUserRequestDto } from '../src/users/dto/createUserRequest.dto';

const userCreateReq: CreateUserRequestDto = {
  email: 'test@example.com',
  firstName: 'Pepe',
  lastName: 'Lopez',
  phoneNumber: '+54912345678',
};

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
    let userId = '';

    it('create user', async () => {
      const {
        status,
        body: { data: createResponse },
      } = await request(app.getHttpServer()).post('/users').send(userCreateReq);
      expect(status).toBe(201);
      expect(createResponse.id).toBeDefined();
      userId = createResponse.id;
    });

    it('get user by id as super_admin - ok', async () => {
      jwt = await jwtCreator({
        ...userCreateReq,
        id: userId,
        roles: ['super_admin'],
      });
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(status).toBe(200);
      expect(data.firstName).toEqual(userCreateReq.firstName);
      expect(data.lastName).toEqual(userCreateReq.lastName);
      expect(data.email).toEqual(userCreateReq.email);
      expect(data.phoneNumber).toEqual(userCreateReq.phoneNumber);
      expect(data.roles).toEqual(['customer']);
    });

    it('get user by id as super_admin - bad request', async () => {
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .get(`/users/ñ{ñ{ñ{}}}`)
        .set('Authorization', `Bearer ${jwt}`);

      expect(status).toBe(400);
      expect(error).toBeDefined();
    });

    it('get user by id as super_admin - not found', async () => {
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
