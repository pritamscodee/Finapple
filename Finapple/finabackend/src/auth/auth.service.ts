import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from "bcrypt";
import { eq } from 'drizzle-orm';


import type { LoginBody, registerBody } from './auth.controller';
import { users } from 'src/db/schema';
import { use } from 'passport';






@Injectable()
export class AuthService {

    constructor(
        @Inject('DRIZZLE') private db: any,
        private jwtService: JwtService,
    ) { }

    async register(b: registerBody) {

        if (!b.email.includes("@")) {
            console.log(" validatin error : Email must have @ ")
            throw new BadRequestException('Email must have @  ... ')

        }
        const [existingUser] = await this.db.select()
            .from(users)
            .where(eq(users.email, b.email))
            .limit(1);

        if (existingUser ) {
         
            throw new ConflictException('User email  already exists. Please use a different user or log in.');
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
            return {
                message: "Registration Success",
                status: 201
            }
        }
    }

    async login(b: LoginBody) {
        const email = b.email;
        const pass = b.password.trim();

        const user = await this.db.query.users.findFirst({
            where: eq(users.email, email),
        });

        console.log("User first query data login:", user);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");

        }
        const passIsMatch = await bcrypt.compare(pass, user.password);

        if (!passIsMatch) {
            throw new UnauthorizedException("Invalid credentials: Password does not match");

        }

        const payload = {
            id: user.id,
            email: b.email,

        };

        const accessToken = this.jwtService.sign(payload);

        return {
            message: "Login successfully done",
            token: accessToken,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }



}