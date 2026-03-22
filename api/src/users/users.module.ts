import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { ProductsModule } from "src/products/products.module";
import { CloudinaryModule } from "src/_modules/cloudinary/cloudinary.module";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		forwardRef(() => AuthModule),
		forwardRef(() => ProductsModule),
		CloudinaryModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
