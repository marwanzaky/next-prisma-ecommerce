import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Product, ProductSchema } from "@/app/products/entities/product.entity";
import { ProductsService } from "@/app/products/products.service";
import { User, UserSchema } from "@/app/users/entities/user.entity";

import { CategoriesModule } from "@/services/categories/categories.module";
import { TranslationModule } from "@/services/translation/translation.module";

import { Review, ReviewSchema } from "./entities/review.entity";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Review.name, schema: ReviewSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: User.name, schema: UserSchema },
		]),
		CategoriesModule,
		TranslationModule,
	],
	controllers: [ReviewsController],
	providers: [ReviewsService, ProductsService],
})
export class ReviewsModule {}
