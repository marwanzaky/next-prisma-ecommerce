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

import { Response } from "express";
import { Profile } from "passport-google-oauth20";

import { IRequest } from "@/types/request.type";

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
	async googleAuthRedirect(@Req() req: IRequest, @Res() res: Response) {
		const clientUrl = process.env.CLIENT_URL!;

		const { token } = await this.authService.loginWithGoogle(
			req.user as unknown as Profile,
		);

		return res.redirect(`${clientUrl}/auth/success?token=${token}`);
	}

	@Post("signup")
	@ApiOperation({
		summary: "Register a new user",
	})
	signUp(@Body() signupDto: SignUpDto) {
		return this.authService.signUp(signupDto);
	}

	@Post("login")
	@ApiOperation({
		summary: "Log in and get an access token",
	})
	signin(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
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
	resetPassword(
		@Body() { newPassword }: ResetPasswordDto,
		@Param("token") token: string,
	) {
		return this.authService.resetPassword({ token, newPassword });
	}

	@Get("verify")
	@ApiOperation({
		summary: "Verify email using token",
	})
	verifyEmail(@Query() query: VerifyEmailDto) {
		return this.authService.verifyEmail(query.token);
	}
}
