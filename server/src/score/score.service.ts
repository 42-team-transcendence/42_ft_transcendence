import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  async updateScore(score: number, request: Request) {
    const userId = request.user.id;

    try {
      // Perform some logic with the user ID and score
      // For example, you can update the user's score in the database using the PrismaService
      await this.prisma.user.update({
        where: { id: userId },
        data: { score: score },
      });

      console.log(`Score updated successfully for user with ID: ${userId}`);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  }
}
