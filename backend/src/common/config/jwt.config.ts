import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get<string>('JWT_ACCESS_SECRET'),
  signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN') },
});