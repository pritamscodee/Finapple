import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from "express";

export interface registerBody {
    name: string;
    email: string;
    password: string;
}


export interface LoginBody {
    email: string,
    password: string
}


@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService) { }

    @Post('/register')
    register(@Body() body: registerBody) {
        return this.authservice.register(body);
    }


    @Post('/login')
    async login(@Body() body: LoginBody,
        @Res({ passthrough: true }) res: Response
    ) {
        const data = await this.authservice.login(body)
        res.cookie("access_token", data.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24,
        });

        return {
            token:data.token,
            message: data.message,
            user: data.user,
        };


    }


}
