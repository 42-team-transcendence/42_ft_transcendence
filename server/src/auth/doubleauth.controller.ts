import { Controller, Post, Body, Res } from '@nestjs/common';
import { DoubleAuthService } from './doubleauth.service';
import speakeasy from 'speakeasy';
import { Response } from 'express';
import { DoubleAuthDto } from './dto/doubleAuth.dto';


@Controller('2fa')
export class DoubleAuthController {
  constructor(private readonly doubleAuthService: DoubleAuthService) {}

  @Post('verify2fa')
  async verify2FA(
    @Body() dto: DoubleAuthDto,
    @Res() res) {
    // Verify the 2FA code using the DoubleAuthService
    const isVerified = await this.doubleAuthService.verify2FA(dto.email, dto.otp);

    // Return the verification result in the response
    return res.json({ isVerified });
  }
}
