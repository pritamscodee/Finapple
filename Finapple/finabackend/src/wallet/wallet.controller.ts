import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/balance')
  getBalance(@Req() req: any) {
    return this.walletService.getBalance(req.user.id);
  }

  @Post('/deposit')
  deposit(
    @Req() req: any,
    @Body() body: { amount: number; description?: string; category?: string },
  ) {
    return this.walletService.deposit(req.user.id, body.amount, body.description, body.category);
  }

  @Post('/withdraw')
  withdraw(
    @Req() req: any,
    @Body() body: { amount: number; description?: string; category?: string },
  ) {
    return this.walletService.withdraw(req.user.id, body.amount, body.description, body.category);
  }

  @Post('/transfer')
  transfer(
    @Req() req: any,
    @Body() body: { recipientEmail: string; amount: number; description?: string },
  ) {
    return this.walletService.transfer(
      req.user.id,
      body.recipientEmail,
      body.amount,
      body.description,
    );
  }

  @Get('/transactions')
  getTransactions(@Req() req: any, @Query('limit') limit?: string) {
    return this.walletService.getTransactions(
      req.user.id,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('/stats/monthly')
  getMonthlyStats(@Req() req: any, @Query('month') month?: string) {
    const m = month || new Date().toISOString().slice(0, 7);
    return this.walletService.getMonthlyStats(req.user.id, m);
  }

  @Get('/stats/trend')
  getLast6MonthsStats(@Req() req: any) {
    return this.walletService.getLast6MonthsStats(req.user.id);
  }
}
