import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtGuard } from "../auth/guard";
import { ScoreService } from './score.service';
import { GetUser } from "../auth/decorator"

@UseGuards(JwtGuard)
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async updateScore(
    @Body() body: { score: number },
    @GetUser() user) {
    const { score } = body;
    console.log({score});
    console.log({user});
    await this.scoreService.updateScore(score, user.sub);
  }
}
