import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService, AUTH_PROVIDERS } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { LocalAuthProvider } from './providers/local-auth.provider';
import { AdAuthProvider } from './providers/ad-auth.provider';

@Module({
  imports: [
    UsersModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRES_IN') || configService.get<string>('JWT_EXPIRES_IN') || '1h') as `${number}ms` | `${number}s` | `${number}m` | `${number}h` | `${number}d`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalAuthProvider,
    AdAuthProvider,
    {
      provide: AUTH_PROVIDERS,
      useFactory: (
        configService: ConfigService,
        adProvider: AdAuthProvider,
        localProvider: LocalAuthProvider,
      ) => {
        const adEnabled = configService.get<string>('AD_ENABLED') === 'true';
        // AD 啟用時僅用 AD，失敗即拒絕；未啟用時僅用 local
        return adEnabled ? [adProvider] : [localProvider];
      },
      inject: [ConfigService, AdAuthProvider, LocalAuthProvider],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
