import { Module } from "@nestjs/common";

import { CategoriesModule } from "@/services/categories/categories.module";
import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";
import { TranslationModule } from "@/services/translation/translation.module";

import { PrismaService } from "@/prisma.service";

import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { GeminiModule } from "@/services/gemini/gemini.module";

@Module({
	imports: [
		CloudinaryModule,
		CategoriesModule,
		TranslationModule,
		GeminiModule,
	],
	controllers: [ProductsController],
	providers: [ProductsService, PrismaService],
	exports: [ProductsService, PrismaService],
})
export class ProductsModule {}
