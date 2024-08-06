import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { BcryptModule } from '../core/bcrypt/bcript.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    BcryptModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '15h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],

  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
