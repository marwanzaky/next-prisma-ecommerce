import { Module } from "@nestjs/common";

import { ProductsService } from "@/app/products/products.service";

import { CategoriesModule } from "@/services/categories/categories.module";
import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";
import { TranslationModule } from "@/services/translation/translation.module";

import { PrismaService } from "@/prisma.service";

import { ReviewsController } from "./reviews.controller";

@Module({
	imports: [CloudinaryModule, CategoriesModule, TranslationModule],
	controllers: [ReviewsController],
	providers: [ProductsService, PrismaService],
})
export class ReviewsModule {}
