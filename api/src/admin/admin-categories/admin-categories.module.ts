import { Module } from "@nestjs/common";
import { AdminCategoriesController } from "./admin-categories.controller";
import { CategoriesModule } from "src/_modules/categories/categories.module";
import { CloudinaryModule } from "src/_modules/cloudinary/cloudinary.module";

@Module({
	imports: [CategoriesModule, CloudinaryModule],
	controllers: [AdminCategoriesController],
})
export class AdminCategoriesModule {}
