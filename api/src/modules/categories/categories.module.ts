import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Product, ProductSchema } from "@/products/entities/product.entity";

import { TranslationModule } from "../translation/translation.module";
import { CategoriesService } from "./categories.service";
import { Category, CategorySchema } from "./entities/category.entity";

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
