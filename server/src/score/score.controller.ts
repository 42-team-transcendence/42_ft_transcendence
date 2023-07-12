import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ScoreService } from './score.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('score')
@UseGuards(AuthGuard())
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post('score')
  async updateScore(@Body() body: { score: number }, @Req() request: Request) {
    const { score } = body;
    await this.scoreService.updateScore(score, request);
  }
}
