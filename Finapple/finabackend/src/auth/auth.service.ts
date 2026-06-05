import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { LoginBody, registerBody } from './auth.controller';
import { users } from '../db/schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DRIZZLE') private db: any,
    private jwtService: JwtService,
  ) {}

  async register(b: registerBody) {
    if (!b.email.includes('@')) {
      throw new BadRequestException('Email must have @');
    }

    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, b.email))
      .limit(1);

    if (existingUser) {
      throw new ConflictException(
        'User email already exists. Please use a different email or log in.',
      );
    }

    if (!b.password || b.password.trim().length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const saltRounds = 10;
    const hashPass = await bcrypt.hash(b.password, saltRounds);
    const insertedUser = await this.db.insert(users).values({
      fullName: b.name,
      email: b.email,
      password: hashPass,
      balance: '0',
    });

    if (insertedUser.rowCount > 0) {
      return { message: 'Registration Success', status: 201 };
    }
  }

  async login(b: LoginBody) {
    const email = b.email;
    const pass = b.password.trim();

    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passIsMatch = await bcrypt.compare(pass, user.password);
    if (!passIsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: b.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successfully done',
      token: accessToken,
      user: { id: user.id, email: user.email, name: user.fullName },
    };
  }

  async getMe(userId: string) {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        balance: users.balance,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, fullName: string) {
    if (!fullName || fullName.trim().length < 2) {
      throw new BadRequestException('Name must be at least 2 characters');
    }
    await this.db
      .update(users)
      .set({ fullName: fullName.trim() })
      .where(eq(users.id, userId));
    return { message: 'Profile updated successfully' };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    if (!newPassword || newPassword.trim().length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    const [user] = await this.db
      .select({ password: users.password })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.db.update(users).set({ password: hashed }).where(eq(users.id, userId));
    return { message: 'Password changed successfully' };
  }
}
