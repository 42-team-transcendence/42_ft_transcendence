import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { DoubleAuthService } from './doubleauth.service';
import speakeasy from 'speakeasy';
import { Request, Response } from 'express';
import { GetUser } from "../auth/decorator"



@Controller('2fa')
export class DoubleAuthController {
    constructor(private readonly doubleAuthService: DoubleAuthService) {}

  @Get('generate')
  async generate2FA(@Res() res: Response) {
    // Generate the secret and QR code using the DoubleAuthService
    const secret = speakeasy.generateSecret();
    const qrcode = await this.doubleAuthService.generateQRCode(secret.otpauth_url);

    // Return the secret and QR code data in the response
    return res.json({ secret: secret.base32, qrcode });
  }

  @Post('verify2fa')
  async verify2FA(
    @Body() dto: any,
    @Res() res) {
    console.log(`CODE = ${dto.otp} USER =`, {dto});
    // Verify the 2FA code using the DoubleAuthService
    const isVerified = await this.doubleAuthService.verify2FA(dto.email, dto.opt);

    // Return the verification result in the response
    return res.json({ isVerified });
  }
}
