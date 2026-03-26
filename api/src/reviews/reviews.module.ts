import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { ProductsService } from "@products/products.service";
import { Review, ReviewSchema } from "./entities/review.entity";
import { Product, ProductSchema } from "@products/entities/product.entity";
import { User, UserSchema } from "@users/entities/user.entity";
import { CategoriesModule } from "@modules/categories/categories.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Review.name, schema: ReviewSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: User.name, schema: UserSchema },
		]),
		CategoriesModule,
	],
	controllers: [ReviewsController],
	providers: [ReviewsService, ProductsService],
})
export class ReviewsModule {}
