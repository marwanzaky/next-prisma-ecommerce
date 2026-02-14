import { Module } from "@nestjs/common";
import { AdminCategoriesController } from "./admin-categories.controller";
import { CategoriesModule } from "src/_modules/categories/categories.module";

@Module({
	imports: [CategoriesModule],
	controllers: [AdminCategoriesController],
})
export class AdminCategoriesModule {}
