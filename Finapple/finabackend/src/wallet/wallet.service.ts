import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, desc, and, gte, lte, lt, sql } from 'drizzle-orm';
import { users, transactions } from '../db/schema';

@Injectable()
export class WalletService {
  constructor(@Inject('DRIZZLE') private db: any) {}

  async getBalance(userId: string) {
    const [user] = await this.db
      .select({ balance: users.balance, fullName: users.fullName, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');
    return { balance: user.balance, fullName: user.fullName, email: user.email };
  }

  async deposit(userId: string, amount: number, description?: string, category?: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const [user] = await this.db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');

    const newBalance = (parseFloat(user.balance) + amount).toFixed(2);

    await this.db.update(users).set({ balance: newBalance }).where(eq(users.id, userId));

    await this.db.insert(transactions).values({
      userId,
      type: 'deposit',
      amount: amount.toFixed(2),
      balanceAfter: newBalance,
      description: description || 'Deposit',
      category: category || 'income',
    });

    return { message: 'Deposit successful', balance: newBalance };
  }

  async withdraw(userId: string, amount: number, description?: string, category?: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const [user] = await this.db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');

    const currentBalance = parseFloat(user.balance);
    if (currentBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const newBalance = (currentBalance - amount).toFixed(2);

    await this.db.update(users).set({ balance: newBalance }).where(eq(users.id, userId));

    await this.db.insert(transactions).values({
      userId,
      type: 'withdrawal',
      amount: amount.toFixed(2),
      balanceAfter: newBalance,
      description: description || 'Withdrawal',
      category: category || 'other',
    });

    return { message: 'Withdrawal successful', balance: newBalance };
  }

  async transfer(senderId: string, recipientEmail: string, amount: number, description?: string) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const [sender] = await this.db
      .select({ balance: users.balance, email: users.email })
      .from(users)
      .where(eq(users.id, senderId))
      .limit(1);

    if (!sender) throw new NotFoundException('Sender not found');

    const senderBalance = parseFloat(sender.balance);
    if (senderBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const [recipient] = await this.db
      .select({ id: users.id, balance: users.balance, email: users.email })
      .from(users)
      .where(eq(users.email, recipientEmail))
      .limit(1);

    if (!recipient) throw new NotFoundException('Recipient not found');
    if (recipient.id === senderId) throw new BadRequestException('Cannot transfer to yourself');

    const senderNewBalance = (senderBalance - amount).toFixed(2);
    const recipientNewBalance = (parseFloat(recipient.balance) + amount).toFixed(2);

    await this.db.update(users).set({ balance: senderNewBalance }).where(eq(users.id, senderId));
    await this.db.update(users).set({ balance: recipientNewBalance }).where(eq(users.id, recipient.id));

    const desc = description || `Transfer to ${recipientEmail}`;

    await this.db.insert(transactions).values({
      userId: senderId,
      type: 'transfer_out',
      amount: amount.toFixed(2),
      balanceAfter: senderNewBalance,
      description: desc,
      category: 'transfer',
      recipientId: recipient.id,
      recipientEmail,
    });

    await this.db.insert(transactions).values({
      userId: recipient.id,
      type: 'transfer_in',
      amount: amount.toFixed(2),
      balanceAfter: recipientNewBalance,
      description: `Transfer from ${sender.email}`,
      category: 'transfer',
      recipientId: senderId,
      recipientEmail: sender.email,
    });

    return { message: 'Transfer successful', balance: senderNewBalance };
  }

  async getTransactions(userId: string, limit = 50) {
    return this.db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  async getMonthlyStats(userId: string, month: string) {
    // month format: "2025-05" — build local-time date range
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

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryBreakdown: Record<string, number> = {};
    const dailyMap: Record<string, { income: number; expense: number }> = {};

    for (const tx of txs) {
      const amt = parseFloat(tx.amount);
      const day = new Date(tx.createdAt).toISOString().slice(0, 10);

      if (!dailyMap[day]) dailyMap[day] = { income: 0, expense: 0 };

      if (tx.type === 'deposit' || tx.type === 'transfer_in') {
        totalIncome += amt;
        dailyMap[day].income += amt;
      } else {
        totalExpense += amt;
        dailyMap[day].expense += amt;
        const cat = tx.category ?? 'other';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + amt;
      }
    }

    const dailyTrend = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, vals]) => ({ date, ...vals }));

    const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));

    return {
      month,
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      netSavings: parseFloat((totalIncome - totalExpense).toFixed(2)),
      categoryBreakdown: categoryData,
      dailyTrend,
      transactionCount: txs.length,
    };
  }

  async getLast6MonthsStats(userId: string) {
    const results = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const stats = await this.getMonthlyStats(userId, month);
      results.push({ month, income: stats.totalIncome, expense: stats.totalExpense, savings: stats.netSavings });
    }
    return results;
  }
}
