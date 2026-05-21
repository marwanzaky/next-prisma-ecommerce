import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { Profile } from "passport-google-oauth20";

import { UserRole } from "@repo/database";

import { ResendService } from "@/services/resend/resend.service";

import { generatePassword } from "@/helper/string.helper";
import { PrismaService } from "@/prisma.service";
import { IRequest } from "@/types/request.type";

import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private prismaService: PrismaService,
		private resendService: ResendService,
	) {}

	extractTokenFromHeader(request: IRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}

	async createAccessToken(userId: string, role: UserRole) {
		return await this.jwtService.sign(
			{ id: userId, role },
			{
				secret: this.configService.get("JWT_SECRET"),
				expiresIn: this.configService.get("JWT_EXPIRES"),
			},
		);
	}
	async loginWithGoogle(user: Profile): Promise<{ token: string }> {
		const userEmail = user.emails?.[0].value || "";

		const existingUser = await this.prismaService.user.findUnique({
			where: { email: userEmail },
			select: {
				id: true,
				role: true,
			},
		});

		if (!existingUser) {
			const randomPassword = generatePassword();
			const hashedPassword = await hash(randomPassword, 12);

			const createdUser = await this.prismaService.user.create({
				data: {
					email: userEmail,
					name: `${user.name?.givenName ?? ""} ${user.name?.familyName ?? ""}`.trim(),
					password: hashedPassword,
					avatarUrl: user.photos?.[0].value,
					isVerified: true,
				},
			});

			await this.prismaService.cart.create({
				data: {
					userId: createdUser.id,
					items: {
						create: [],
					},
				},
			});

			return {
				token: await this.createAccessToken(createdUser.id, createdUser.role),
			};
		}

		return {
			token: await this.createAccessToken(existingUser.id, existingUser.role),
		};
	}

	async signUp(signupDto: SignUpDto) {
		const verificationToken = randomBytes(32).toString("hex");
		const emailVerificationTokenHash = createHash("sha256")
			.update(verificationToken)
			.digest("hex");
		const emailVerificationTokenExpiresAt = new Date(
			Date.now() + 1000 * 60 * 60 * 24,
		);

		const hashedPassword = await hash(signupDto.password, 12);

		const user = await this.prismaService.user.create({
			data: {
				...signupDto,
				password: hashedPassword,
				isVerified: false,
				emailVerificationTokenHash,
				emailVerificationTokenExpiresAt,
			},
		});

		const verifyUrl = `${process.env.CLIENT_URL}/auth/verify?token=${verificationToken}`;

		await this.resendService.sendEmailVerification(user.email, verifyUrl);

		return {
			token: await this.createAccessToken(user.id, user.role),
		};
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		const user = await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new UnauthorizedException("Invalid email or password");
		}

		return {
			token: await this.createAccessToken(user.id, user.role),
		};
	}

	async verifyEmail(token: string) {
		const tokenHash = createHash("sha256").update(token).digest("hex");

		const user = await this.prismaService.user.findFirst({
			where: {
				emailVerificationTokenHash: tokenHash,
				emailVerificationTokenExpiresAt: {
					gt: new Date(),
				},
			},
			select: {
				id: true,
			},
		});

		if (!user) {
			throw new BadRequestException("Invalid or expired verification token");
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				isVerified: true,
				emailVerificationTokenHash: null,
				emailVerificationTokenExpiresAt: null,
			},
		});

		return { verified: true };
	}

	async forgotPassword(email: string) {
		const response = {
			status: "success",
			message: "Token sent to email",
		};

		const user = await this.prismaService.user.findFirst({
			where: { email: email.toLowerCase() },
			select: { id: true, email: true },
		});

		// NOTE: Always return same response even if the user does not exist for security reasons
		if (!user) {
			return response;
		}

		const resetToken = randomBytes(32).toString("hex");

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				passwordResetToken: createHash("sha256")
					.update(resetToken)
					.digest("hex"),
				passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
			},
		});

		const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

		await this.resendService.sendEmailResetPassword(user.email, resetUrl);

		return response;
	}

	async resetPassword({
		token,
		newPassword,
	}: {
		token: string;
		newPassword: string;
	}) {
		const hashedToken = createHash("sha256").update(token).digest("hex");

		const user = await this.prismaService.user.findFirst({
			where: {
				passwordResetToken: hashedToken,
				passwordResetExpires: {
					gt: new Date(),
				},
			},
			select: {
				id: true,
				role: true,
			},
		});

		if (!user) {
			throw new BadRequestException("Token is invalid or has expired");
		}

		const hashedPassword = await hash(newPassword, 12);

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: hashedPassword,
				passwordResetToken: null,
				passwordResetExpires: null,
				passwordChangedAt: new Date(Date.now() - 1000),
			},
		});

		return {
			token: await this.createAccessToken(user.id, user.role),
		};
	}
}
