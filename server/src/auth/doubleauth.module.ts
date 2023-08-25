import { Module } from '@nestjs/common';
import { DoubleAuthController } from './doubleauth.controller';
import { DoubleAuthService } from './doubleauth.service';

@Module({
  controllers: [DoubleAuthController],
  providers: [DoubleAuthService],
})
export class DoubleAuthModule {}
