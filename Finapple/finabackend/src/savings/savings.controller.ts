import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SavingsService } from './savings.service';

@Controller('savings')
@UseGuards(AuthGuard('jwt'))
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post('/')
  createGoal(
    @Req() req: any,
    @Body() body: { name: string; targetAmount: number; deadline?: string },
  ) {
    return this.savingsService.createGoal(
      req.user.id,
      body.name,
      body.targetAmount,
      body.deadline,
    );
  }

  @Get('/')
  getGoals(@Req() req: any) {
    return this.savingsService.getGoals(req.user.id);
  }

  @Post('/:id/add')
  addToGoal(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { amount: number },
  ) {
    return this.savingsService.addToGoal(req.user.id, parseInt(id), body.amount);
  }

  @Delete('/:id')
  deleteGoal(@Req() req: any, @Param('id') id: string) {
    return this.savingsService.deleteGoal(req.user.id, parseInt(id));
  }
}
