import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Review, ReviewSchema } from "@/app/reviews/entities/review.entity";

import { CategoriesModule } from "@/services/categories/categories.module";
import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";
import { TranslationModule } from "@/services/translation/translation.module";

import { Product, ProductSchema } from "./entities/product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
		CloudinaryModule,
		CategoriesModule,
		TranslationModule,
	],
	controllers: [ProductsController],
	providers: [ProductsService],
	exports: [ProductsService],
})
export class ProductsModule {}
