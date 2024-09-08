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
  email: 'test-users@example.com',
  firstName: 'Fulanito',
  lastName: 'Dwight',
  phoneNumber: '+54912345678',
  roles: [],
};

describe('User Module (e2e)', () => {
  let app: INestApplication;
  let superAdminJwt = '';

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

  beforeAll(async () => {
    superAdminJwt = await jwtCreator({
      userId: '1',
      email: 'super_admin@example.com',
      companyId: null,
      roles: ['super_admin'],
    });
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  describe('users flow', () => {
    let userId = '';

    it('create user', async () => {
      const {
        status,
        body: { data: createResponse },
      } = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${superAdminJwt}`)
        .send(userCreateReq);
      expect(status).toBe(201);
      expect(createResponse.id).toBeDefined();
      userId = createResponse.id;
    });

    it('count users - super_admin - ok', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .get(`/users/count`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(200);
      expect(data).toBe(1);
    });

    it('get all - super_admin - ok', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .get(`/users`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(200);
      expect(data.docs).toBeDefined();
      expect(data.docs.length).toBe(1);
      expect(data.docs[0].id).toBe(userId);
    });

    it('get all query email - super_admin - ok', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .get(`/users?email=${userCreateReq.email}`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(200);
      expect(data.docs).toBeDefined();
      expect(data.docs.length).toBe(1);
      expect(data.docs[0].id).toBe(userId);
    });

    it('get all query email - super_admin - no results', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .get(`/users?email=asdfasdfasdf`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(200);
      expect(data.docs).toBeDefined();
      expect(data.docs.length).toBe(0);
    });

    it('get by id - super_admin - ok', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(200);
      expect(data.firstName).toEqual(userCreateReq.firstName);
      expect(data.lastName).toEqual(userCreateReq.lastName);
      expect(data.email).toEqual(userCreateReq.email);
      expect(data.phoneNumber).toEqual(userCreateReq.phoneNumber);
    });

    it('get by id - super_admin - bad request', async () => {
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .get(`/users/ñ{ñ{ñ{}}}`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(400);
      expect(error).toBeDefined();
    });

    it('get by id - super_admin - not found', async () => {
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .get(`/users/5d7b9a0a7adcba4a`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(400);
      expect(error).toBeDefined();
    });

    it('update by id - super_admin - ok', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${superAdminJwt}`)
        .send({
          firstName: 'Nuevo Nombre',
        });

      const {
        body: { data: dataGet },
      } = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(200);
      expect(data).toBe(true);
      expect(dataGet.firstName).toEqual('Nuevo Nombre');
      expect(dataGet.lastName).toEqual(userCreateReq.lastName);
      expect(dataGet.email).toEqual(userCreateReq.email);
      expect(dataGet.phoneNumber).toEqual(userCreateReq.phoneNumber);
    });

    it('delete by id - ok', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${superAdminJwt}`)
        .send(userCreateReq);

      const { status: statusGet } = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${superAdminJwt}`);

      expect(status).toBe(200);
      expect(data).toBe(true);
      expect(statusGet).toBe(404);
    });
  });
});
