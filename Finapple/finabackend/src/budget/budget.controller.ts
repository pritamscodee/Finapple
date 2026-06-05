import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetService } from './budget.service';

@Controller('budget')
@UseGuards(AuthGuard('jwt'))
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('/')
  setBudget(
    @Req() req: any,
    @Body() body: { category: string; limitAmount: number; month: string },
  ) {
    return this.budgetService.setBudget(
      req.user.id,
      body.category,
      body.limitAmount,
      body.month,
    );
  }

  @Get('/')
  getBudgets(@Req() req: any, @Query('month') month?: string) {
    const m = month || new Date().toISOString().slice(0, 7);
    return this.budgetService.getBudgets(req.user.id, m);
  }

  @Delete('/:id')
  deleteBudget(@Req() req: any, @Param('id') id: string) {
    return this.budgetService.deleteBudget(req.user.id, parseInt(id));
  }
}
