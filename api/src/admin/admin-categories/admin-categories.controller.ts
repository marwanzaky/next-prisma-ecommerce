import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoriesService } from "src/_modules/categories/categories.service";

@Controller("admin/categories")
@ApiTags("Admin Categories")
export class AdminCategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	@Get()
	@ApiOperation({
		summary: "Get all categories (admin)",
	})
	async getAllCategories() {
		return this.categoriesService.find();
	}

	@Post()
	@ApiOperation({
		summary: "Create new category (admin)",
	})
	async create(@Body() { name, parent, slug, sortOrder }: CreateCategoryDto) {
		return this.categoriesService.create({
			name,
			parent: parent ? parent : null,
			slug,
			sortOrder,
		});
	}

	@Patch()
	@ApiOperation({
		summary: "Update an existing category (admin)",
	})
	async update(@Body() { name, parent, slug, sortOrder }: UpdateCategoryDto) {
		return this.categoriesService.create({
			name,
			parent,
			slug,
			sortOrder,
		});
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Deactivate an existing category (admin)",
	})
	async delete(@Param("id") id: string) {
		return this.categoriesService.findOneAndUpdate(id, { isActive: false });
	}
}
