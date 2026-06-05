import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
