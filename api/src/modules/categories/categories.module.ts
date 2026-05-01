import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { TranslationModule } from "../translation/translation.module";
import { CategoriesService } from "./categories.service";
import { Category, CategorySchema } from "./entities/category.entity";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
		]),
		TranslationModule,
	],
	providers: [CategoriesService],
	exports: [CategoriesService],
})
export class CategoriesModule {}
