import { Module } from "@nestjs/common";
import { AdminCategoriesController } from "./admin-categories.controller";
import { CategoriesModule } from "@modules/categories/categories.module";
import { CloudinaryModule } from "@modules/cloudinary/cloudinary.module";

@Module({
	imports: [CategoriesModule, CloudinaryModule],
	controllers: [AdminCategoriesController],
})
export class AdminCategoriesModule {}
