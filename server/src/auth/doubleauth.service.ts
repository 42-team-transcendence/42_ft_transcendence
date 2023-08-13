import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';


@Injectable()
export class DoubleAuthService {
  constructor(private prisma: PrismaService) {}

  async generateQRCode(otpauthUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      qrcode.toDataURL(otpauthUrl, function (err: any, data: string) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async verify2FA(user: any, code: string): Promise<boolean> {
    const secret = user.secret;
    if (!secret) {
      return false;
    }

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    return verified;
  }

  async saveUserSecret(userEmail: string, secret: string): Promise<void> {
	console.log('UserId:', userEmail);
	try {
	  await this.prisma.user.update({
		where: { email: userEmail }, // Make sure to use the userId parameter to identify the user
		data: {
		  secret: secret,
		},
	  });
	} catch (error) {
	  // Handle any potential errors that may occur during the update process
	  console.error('Error updating user secret:', error);
	  throw new Error('Failed to save user secret.');
	}
  }
}



