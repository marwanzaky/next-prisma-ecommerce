import { Module } from "@nestjs/common";

import { CategoriesModule } from "@/services/categories/categories.module";
import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";
import { TranslationModule } from "@/services/translation/translation.module";

import { PrismaService } from "@/prisma.service";

import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
	imports: [CloudinaryModule, CategoriesModule, TranslationModule],
	controllers: [ProductsController],
	providers: [ProductsService, PrismaService],
	exports: [ProductsService, PrismaService],
})
export class ProductsModule {}
