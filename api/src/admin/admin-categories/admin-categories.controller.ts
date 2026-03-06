import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoriesService } from "src/_modules/categories/categories.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "src/_modules/cloudinary/cloudinary.service";

@Controller("admin/categories")
@ApiTags("Admin Categories")
export class AdminCategoriesController {
	constructor(
		private cloudinaryService: CloudinaryService,
		private categoriesService: CategoriesService,
	) {}

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

	@Patch(":id")
	@ApiOperation({
		summary: "Update an existing category (admin)",
	})
	@UseInterceptors(FileInterceptor("image"))
	async update(
		@Param("id") id: string,
		@Body() { name, parent, slug, sortOrder, isActive }: UpdateCategoryDto,
		@UploadedFile() file?: Express.Multer.File,
	) {
		let imageUrl: string | undefined;

		if (file) {
			imageUrl = await this.cloudinaryService.uploadFile(file);
		}

		return this.categoriesService.findOneAndUpdate(id, {
			name,
			parent,
			slug,
			sortOrder,
			imgUrl: imageUrl ? imageUrl : undefined,
			isActive,
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
