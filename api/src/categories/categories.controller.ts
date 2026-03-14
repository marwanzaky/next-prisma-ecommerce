import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { CategoriesService } from "src/_modules/categories/categories.service";
import { Public } from "src/auth/auth.guard";

@Controller("categories")
@Public()
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	@Get()
	@ApiOperation({
		summary: "Get all categories",
	})
	async getAllCategories() {
		return this.categoriesService.findPublic({ isActive: true });
	}

	@Get("tree")
	@ApiOperation({
		summary: "Get categories tree",
	})
	async getCategoryTree() {
		return this.categoriesService.getPublicCategoryTree();
	}
}
