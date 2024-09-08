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
import { jwtCreator } from './helpers';
import { Role } from '../src/common/enums/role.enum';

const userCreateReq: CreateUserRequestDto = {
  email: 'test-auth@example.com',
  firstName: 'Pepe',
  lastName: 'Lopez',
  phoneNumber: '+54912345678',
  roles: [],
};
const user2CreateReq: CreateUserRequestDto = {
  email: 'test2-auth@example.com',
  firstName: 'Menganito',
  lastName: 'Bach',
  phoneNumber: '+54912345678',
  roles: [Role.SUPER_ADMIN],
};
const tokenTest = 'token1234'; // <== harcodeado en UsersService
const defaultRoles = ['customer'];
const password = '11223344';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let superAdminJwt = '';
  let user1Id = '';

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

  describe('auth flow', () => {
    // **************** auth default role flow **********************
    it('create user without roles (then should assign default role)', async () => {
      const {
        status,
        body: { data: createResponse },
      } = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${superAdminJwt}`)
        .send(userCreateReq);

      user1Id = createResponse.id;
      expect(status).toBe(201);
      expect(createResponse.id).toBeDefined();
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

    it('login - default roles', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password, email: userCreateReq.email });
      expect(status).toBe(201);
      expect(data.email).toEqual(userCreateReq.email);
      expect(data.roles).toEqual(defaultRoles);
      expect(data.id).toBeDefined();
      expect(data.token).toBeDefined();
    });

    it('login bad password', async () => {
      const {
        status,
        body: { error },
      } = await request(app.getHttpServer())
        .post('/auth/login')
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

    // Borramos usuario para evitar error en el siguiente flow
    // ya que token es el mismo siempre en tests
    it('delete created user', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .delete(`/users/${user1Id}`)
        .set('Authorization', `Bearer ${superAdminJwt}`)
        .send(userCreateReq);
      expect(status).toBe(200);
      expect(data).toBe(true);
    });

    // **************** auth pre-assigned roles flow **********************
    it('create user with super_admin role', async () => {
      const {
        status,
        body: { data: createResponse },
      } = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${superAdminJwt}`)
        .send(user2CreateReq);
      expect(status).toBe(201);
      expect(createResponse.id).toBeDefined();
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

    it('login - assigned role', async () => {
      const {
        status,
        body: { data },
      } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ password, email: user2CreateReq.email });
      expect(status).toBe(201);
      expect(data.email).toEqual(user2CreateReq.email);
      expect(data.roles).toEqual(['super_admin']);
      expect(data.id).toBeDefined();
      expect(data.token).toBeDefined();
    });
  });
});
