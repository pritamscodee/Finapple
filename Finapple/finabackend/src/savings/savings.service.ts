import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { savingsGoals } from '../db/schema';

@Injectable()
export class SavingsService {
  constructor(@Inject('DRIZZLE') private db: any) {}

  async createGoal(
    userId: string,
    name: string,
    targetAmount: number,
    deadline?: string,
  ) {
    if (targetAmount <= 0) throw new BadRequestException('Target must be positive');
    if (!name || name.trim().length < 2) throw new BadRequestException('Name too short');

    await this.db.insert(savingsGoals).values({
      userId,
      name: name.trim(),
      targetAmount: targetAmount.toFixed(2),
      savedAmount: '0',
      deadline: deadline || null,
      isCompleted: false,
    });

    return { message: 'Savings goal created' };
  }

  async getGoals(userId: string) {
    const goals = await this.db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, userId));

    return goals.map((g: any) => ({
      id: g.id,
      name: g.name,
      targetAmount: parseFloat(g.targetAmount),
      savedAmount: parseFloat(g.savedAmount),
      remaining: parseFloat(
        Math.max(0, parseFloat(g.targetAmount) - parseFloat(g.savedAmount)).toFixed(2),
      ),
      percentComplete: parseFloat(
        Math.min(100, (parseFloat(g.savedAmount) / parseFloat(g.targetAmount)) * 100).toFixed(1),
      ),
      deadline: g.deadline,
      isCompleted: g.isCompleted,
      createdAt: g.createdAt,
    }));
  }

  async addToGoal(userId: string, goalId: number, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const [goal] = await this.db
      .select()
      .from(savingsGoals)
      .where(and(eq(savingsGoals.id, goalId), eq(savingsGoals.userId, userId)))
      .limit(1);

    if (!goal) throw new NotFoundException('Goal not found');

    const newSaved = Math.min(
      parseFloat(goal.targetAmount),
      parseFloat(goal.savedAmount) + amount,
    );
    const isCompleted = newSaved >= parseFloat(goal.targetAmount);

    await this.db
      .update(savingsGoals)
      .set({ savedAmount: newSaved.toFixed(2), isCompleted })
      .where(eq(savingsGoals.id, goalId));

    return {
      message: isCompleted ? 'Goal completed!' : 'Amount added to goal',
      savedAmount: newSaved,
      isCompleted,
    };
  }

  async deleteGoal(userId: string, goalId: number) {
    const [goal] = await this.db
      .select()
      .from(savingsGoals)
      .where(and(eq(savingsGoals.id, goalId), eq(savingsGoals.userId, userId)))
      .limit(1);

    if (!goal) throw new NotFoundException('Goal not found');

    await this.db.delete(savingsGoals).where(eq(savingsGoals.id, goalId));
    return { message: 'Goal deleted' };
  }
}
