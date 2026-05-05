import {
	forwardRef,
	Inject,
	Injectable,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";

import { compare } from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { Model } from "mongoose";

import { CartsService } from "@/carts/carts.service";
import { UserRole } from "@/shared/types/user.type";
import { IRequest } from "@/types/request.type";
import { User } from "@/users/entities/user.entity";
import { UsersService } from "@/users/users.service";
import { ResendService } from "@/modules/resend/resend.service";

import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import { generatePassword } from "@/common/helper";

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
	async loginWithGoogle(user: {
		email: string;
		firstName: string;
		lastName: string;
	}): Promise<{ token: string }> {
		const existingUser = await this.usersService
			.findByEmail(user.email)
			.catch(() => null);

		if (!existingUser) {
			const randomPassword = generatePassword();

			const createdUser = await this.usersService.create({
				email: user.email,
				name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
				password: randomPassword,
				isVerified: true,
			});

			await this.cartsService.create(createdUser.id, []);

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

		const user = await this.usersService.create({
			...signupDto,
			isVerified: false,
			emailVerificationTokenHash,
			emailVerificationTokenExpiresAt,
		});

		await this.cartsService.create(user.id, []);

		const verifyUrl = `${process.env.CLIENT_URL}/auth/verify?token=${verificationToken}`;
		await this.resendService.sendEmailVerification(user.email, verifyUrl);

		return { token: await this.createAccessToken(user.id, user.role) };
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

		return { token: await this.createAccessToken(user.id, user.role) };
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
}
