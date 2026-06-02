import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { SetMetadata } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { User } from "@repo/database";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest, RequestUser } from "@/types/request.type";

import { AuthService } from "./auth.service";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly jwtSecret: string;

	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private reflector: Reflector,
		private authService: AuthService,
		private prismaService: PrismaService,
	) {
		this.jwtSecret = this.configService.get<string>("JWT_SECRET")!;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const request: AuthenticatedRequest = context.switchToHttp().getRequest();
		const token = this.authService.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException(
				"You are not logged in, Please log in to get access",
			);
		}

		const decoded = await this.jwtService
			.verifyAsync<RequestUser>(token, {
				secret: this.jwtSecret,
			})
			.catch(() => {
				throw new UnauthorizedException();
			});

		const currentUser = await this.prismaService.user.findFirst({
			where: { id: decoded.id },
		});

		if (!currentUser)
			throw new UnauthorizedException(
				"The user belonging to this token does no longer exist",
			);

		if (changedPasswordAfter(currentUser, decoded.iat))
			throw new UnauthorizedException(
				"User recently changed password, Please log in again",
			);

		request.user = decoded;

		return true;
	}
}

function changedPasswordAfter(user: User, jwtTimestamp: number) {
	if (user.passwordChangedAt) {
		const changedTimestamp = Math.floor(
			user.passwordChangedAt.getTime() / 1000,
		);
		return jwtTimestamp < changedTimestamp;
	}

	return false;
}
