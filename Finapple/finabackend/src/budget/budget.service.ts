import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, and, gte, lt } from 'drizzle-orm';
import { budgets, transactions } from '../db/schema';

@Injectable()
export class BudgetService {
  constructor(@Inject('DRIZZLE') private db: any) {}

  async setBudget(userId: string, category: string, limitAmount: number, month: string) {
    if (limitAmount <= 0) throw new BadRequestException('Limit must be positive');

    // Upsert: delete existing for same user/category/month then insert
    await this.db
      .delete(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.category, category),
          eq(budgets.month, month),
        ),
      );

    await this.db.insert(budgets).values({
      userId,
      category,
      limitAmount: limitAmount.toFixed(2),
      month,
    });

    return { message: 'Budget set successfully' };
  }

  async getBudgets(userId: string, month: string) {
    const userBudgets = await this.db
      .select()
      .from(budgets)
      .where(and(eq(budgets.userId, userId), eq(budgets.month, month)));

    // Build date range: full calendar month, timezone-safe
    const [year, mo] = month.split('-').map(Number);
    const startDate = new Date(year, mo - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, mo, 1, 0, 0, 0, 0); // first moment of next month

    const txs = await this.db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          gte(transactions.createdAt, startDate),
          lt(transactions.createdAt, endDate),
        ),
      );

    // Sum spending per category (only outgoing), treat null category as 'other'
    const spendingMap: Record<string, number> = {};
    for (const tx of txs) {
      if (tx.type === 'withdrawal' || tx.type === 'transfer_out') {
        const cat = tx.category ?? 'other';
        spendingMap[cat] = (spendingMap[cat] || 0) + parseFloat(tx.amount);
      }
    }

    return userBudgets.map((b: any) => {
      const spent = spendingMap[b.category] || 0;
      const limit = parseFloat(b.limitAmount);
      return {
        id: b.id,
        category: b.category,
        limitAmount: limit,
        spent: parseFloat(spent.toFixed(2)),
        remaining: parseFloat(Math.max(0, limit - spent).toFixed(2)),
        percentUsed: parseFloat(Math.min(100, (spent / limit) * 100).toFixed(1)),
        month: b.month,
      };
    });
  }

  async deleteBudget(userId: string, budgetId: number) {
    const [budget] = await this.db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, budgetId), eq(budgets.userId, userId)))
      .limit(1);

    if (!budget) throw new NotFoundException('Budget not found');

    await this.db.delete(budgets).where(eq(budgets.id, budgetId));
    return { message: 'Budget deleted' };
  }
}
