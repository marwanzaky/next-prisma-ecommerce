import { Module } from "@nestjs/common";

import { CategoriesModule } from "@/services/categories/categories.module";
import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";

import { AdminCategoriesController } from "./admin-categories.controller";

@Module({
	imports: [CategoriesModule, CloudinaryModule],
	controllers: [AdminCategoriesController],
})
export class AdminCategoriesModule {}
