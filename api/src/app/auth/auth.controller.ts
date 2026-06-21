import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation } from "@nestjs/swagger";

import { CookieOptions, Response } from "express";
import ms from "ms";

import { GoogleRequest } from "@/types/request.type";

import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { SignUpDto } from "./dto/signup.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";

import { Public } from "./auth.guard";
import { AuthService } from "./auth.service";

@Public()
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("google")
	@UseGuards(AuthGuard("google"))
	async googleAuth() {}

	@Get("google/callback")
	@UseGuards(AuthGuard("google"))
	async googleAuthRedirect(
		@Req() req: GoogleRequest,
		@Res({ passthrough: true }) res: Response,
	) {
		const { token } = await this.authService.loginWithGoogle(req.user);

		res.cookie("token", token, getCookieOptions());

		return res.redirect(process.env.CLIENT_URL!);
	}

	@Post("signup")
	@ApiOperation({
		summary: "Register a new user",
	})
	async signUp(
		@Body() signupDto: SignUpDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { token } = await this.authService.signUp(signupDto);

		res.cookie("token", token, getCookieOptions());

		return { success: true };
	}

	@Post("login")
	@ApiOperation({
		summary: "Log in and get an access token",
	})
	async signin(
		@Body() loginDto: LoginDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { token } = await this.authService.login(loginDto);

		res.cookie("token", token, getCookieOptions());

		return { success: true };
	}

	@Post("forgotPassword")
	@ApiOperation({
		summary: "Send password reset email with token",
	})
	forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
		return this.authService.forgotPassword(forgotPassword.email);
	}

	@Patch("resetPassword/:token")
	@ApiOperation({
		summary: "Reset user password using reset token",
	})
	async resetPassword(
		@Body() { newPassword }: ResetPasswordDto,
		@Param("token") incomingToken: string,
		@Res({ passthrough: true }) res: Response,
	) {
		const { token } = await this.authService.resetPassword({
			token: incomingToken,
			newPassword,
		});

		res.cookie("token", token, getCookieOptions());

		return { success: true };
	}

	@Get("verify")
	@ApiOperation({
		summary: "Verify email using token",
	})
	verifyEmail(@Query() query: VerifyEmailDto) {
		return this.authService.verifyEmail(query.token);
	}

	@Post("logout")
	logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie("token", {
			...getCookieOptions(),
			maxAge: undefined,
		});

		return { success: true };
	}
}

export function getCookieOptions(): CookieOptions {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
		maxAge: ms(process.env.JWT_EXPIRES as ms.StringValue),
	};
}
