import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesModule as CategoriesServiceModule } from "src/_modules/categories/categories.module";

@Module({
	imports: [CategoriesServiceModule],
	controllers: [CategoriesController],
})
export class CategoriesModule {}
