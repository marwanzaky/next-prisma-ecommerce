import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";

import { compare } from "bcryptjs";
import { createHash, randomBytes } from "crypto";
import { Model } from "mongoose";
import { Profile } from "passport-google-oauth20";

import { UserRole } from "@repo/types";

import { CartsService } from "@/app/carts/carts.service";
import { User } from "@/app/users/entities/user.entity";
import { UsersService } from "@/app/users/users.service";

import { ResendService } from "@/services/resend/resend.service";

import { generatePassword } from "@/helper/string.helper";
import { IRequest } from "@/types/request.type";

import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private jwtService: JwtService,
		private configService: ConfigService,
		private cartsService: CartsService,
		@Inject(forwardRef(() => UsersService)) private usersService: UsersService,
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
		const existingUser = await this.usersService
			.findByEmail(userEmail)
			.catch(() => null);

		if (!existingUser) {
			const randomPassword = generatePassword();

			const createdUser = await this.usersService.create({
				email: userEmail,
				name: `${user.name?.givenName ?? ""} ${user.name?.familyName ?? ""}`.trim(),
				password: randomPassword,
				photoUrl: user.photos?.[0].value,
				isVerified: true,
			});

			await this.cartsService.create(createdUser._id.toString(), []);

			return {
				token: await this.createAccessToken(
					createdUser._id.toString(),
					createdUser.role,
				),
			};
		}

		return {
			token: await this.createAccessToken(
				existingUser._id.toString(),
				existingUser.role,
			),
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

		const user = await this.usersService.create({
			...signupDto,
			isVerified: false,
			emailVerificationTokenHash,
			emailVerificationTokenExpiresAt,
		});

		await this.cartsService.create(user._id.toString(), []);

		const verifyUrl = `${process.env.CLIENT_URL}/auth/verify?token=${verificationToken}`;
		await this.resendService.sendEmailVerification(user.email, verifyUrl);

		return {
			token: await this.createAccessToken(user._id.toString(), user.role),
		};
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		const user = await this.userModel
			.findOne({
				email,
			})
			.select("+password");

		if (!user) {
			throw new UnauthorizedException("Invalid email or password");
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new UnauthorizedException("Invalid email or password");
		}

		return {
			token: await this.createAccessToken(user._id.toString(), user.role),
		};
	}

	async verifyEmail(token: string) {
		const tokenHash = createHash("sha256").update(token).digest("hex");

		const user = await this.userModel
			.findOne({
				emailVerificationTokenHash: tokenHash,
				emailVerificationTokenExpiresAt: { $gt: new Date() },
			})
			.select(
				"+emailVerificationTokenHash +emailVerificationTokenExpiresAt isVerified",
			);

		if (!user) {
			throw new BadRequestException("Invalid or expired verification token");
		}

		user.isVerified = true;
		user.emailVerificationTokenHash = undefined;
		user.emailVerificationTokenExpiresAt = undefined;

		await user.save();

		return { verified: true };
	}

	async forgotPassword(email: string) {
		const response = {
			status: "success",
			message: "Token sent to email",
		};

		const user = await this.userModel.findOne({ email });

		// NOTE: Always return same response even if the user does not exist for security reasons
		if (!user) {
			return response;
		}

		const resetToken = user.createPasswordResetToken();

		await user.save({ validateBeforeSave: false });

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

		const user = await this.userModel.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		if (!user) {
			throw new BadRequestException("Token is invalid or has expired");
		}

		user.password = newPassword;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save();

		return {
			token: await this.createAccessToken(user.id, user.role),
		};
	}
}
