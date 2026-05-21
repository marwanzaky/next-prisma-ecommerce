import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Public } from "@/app/auth/auth.guard";

import { CategoriesService } from "@/services/categories/categories.service";

import { PrismaService } from "@/prisma.service";

@Controller("categories")
@Public()
export class CategoriesController {
	constructor(
		private categoriesService: CategoriesService,
		private prisma: PrismaService,
	) {}

	@Get()
	@ApiOperation({
		summary: "Get all categories",
	})
	async findMany() {
		return this.prisma.category.findMany({
			where: {
				isActive: true,
			},
		});
	}

	@Get("tree")
	@ApiOperation({
		summary: "Get categories tree",
	})
	async getCategoryTree() {
		return this.categoriesService.getPublicCategoryTree();
	}
}
