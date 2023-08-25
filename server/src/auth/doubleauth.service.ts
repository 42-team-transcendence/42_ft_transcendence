import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode'


@Injectable()
export class DoubleAuthService {
  constructor(private prisma: PrismaService) {}

  async generateQRCode(otpauthUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      qrcode.toDataURL(otpauthUrl, function (err: any, data: string) {
        if (err) {
          reject(err);  console.error("error secret")
        } else {
          resolve(data);
        }
      });
    });
  }

  async verify2FA(userEmail: string, code: string): Promise<boolean> {
    console.log("verify 2fa function user.scret")
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: userEmail},
      })
      console.log("user", {user});
      const secret = user.secret

      if (!secret) {
        return false;
      }
  
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
        window: 1,
      });
      console.log("verified", {verified});
      return verified;
    } catch (error) {
      console.error("error secret = ", error)
    }
  }

  async saveUserSecret(userEmail: string, secret: string): Promise<void> {
	console.log('userEmail:', userEmail);
	try {
	  const updatedUser = await this.prisma.user.update({
      where: { email: userEmail }, // Make sure to use the userId parameter to identify the user
      data: {
        secret: secret,
      },
	  });
    console.log(updatedUser);
	} catch (error) {
	  // Handle any potential errors that may occur during the update process
	  console.error('Error updating user secret:', error);
	  throw new Error('Failed to save user secret.');
	}
  }
}



