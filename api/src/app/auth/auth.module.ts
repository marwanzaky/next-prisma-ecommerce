import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";

import { StringValue } from "ms";

import { CartsModule } from "@/app/carts/carts.module";
import { User, UserSchema } from "@/app/users/entities/user.entity";
import { UsersModule } from "@/app/users/users.module";

import { ResendModule } from "@/services/resend/resend.module";

import { GoogleStrategy } from "@/middlewares/google.strategy";

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
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		CartsModule,
		ResendModule,
		forwardRef(() => UsersModule),
	],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy],
	exports: [AuthService],
})
export class AuthModule {}
