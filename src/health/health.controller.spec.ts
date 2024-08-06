import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

jest.mock('./health.service');
jest.mock('@nestjs/config');

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const healthModule: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot({ pinoHttp: { level: 'silent' } })],
      controllers: [HealthController],
      providers: [HealthService, ConfigService],
    }).compile();

    healthController = healthModule.get<HealthController>(HealthController);
    healthService = healthModule.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
    expect(healthService).toBeDefined();
  });

  describe('function getHealthCheck', () => {
    it('should return health', async () => {
      const spy = jest.spyOn(healthService, 'getHealthCheck');

      healthController.getHealthCheck();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
