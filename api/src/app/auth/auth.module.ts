import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { StringValue } from "ms";

import { CartsModule } from "@/app/carts/carts.module";

import { ResendModule } from "@/services/resend/resend.module";

import { GoogleStrategy } from "@/middlewares/google.strategy";
import { PrismaService } from "@/prisma.service";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					secret: config.get<string>("JWT_SECRET"),
					signOptions: {
						expiresIn: config.get<StringValue>("JWT_EXPIRES"),
					},
				};
			},
		}),
		CartsModule,
		ResendModule,
	],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy, PrismaService],
	exports: [AuthService],
})
export class AuthModule {}
