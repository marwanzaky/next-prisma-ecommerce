import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Product, ProductSchema } from "@/app/products/entities/product.entity";

import { CategoriesService } from "./categories.service";
import { Category, CategorySchema } from "./entities/category.entity";

import { TranslationModule } from "../translation/translation.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
			{ name: Product.name, schema: ProductSchema },
		]),
		TranslationModule,
	],
	providers: [CategoriesService],
	exports: [CategoriesService],
})
export class CategoriesModule {}
