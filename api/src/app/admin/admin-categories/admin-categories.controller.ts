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
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Locale } from "@repo/types";

import { Public } from "@/app/auth/auth.guard";

import { CategoriesService } from "@/services/categories/categories.service";
import { CloudinaryService } from "@/services/cloudinary/cloudinary.service";

import { delay } from "@/helper/promise.helper";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("admin/categories")
@ApiTags("Admin Categories")
export class AdminCategoriesController {
	constructor(
		private cloudinaryService: CloudinaryService,
		private categoriesService: CategoriesService,
	) {}

	@Get("admin/retranslate")
	@ApiOperation({
		summary: "Get all categories (admin)",
	})
	@Public()
	async translate() {
		const defaultLocale = process.env.DEFAULT_LOCALE as Locale;
		const categories = await this.categoriesService.find();

		for (const category of categories) {
			await this.categoriesService.findByIdAndUpdate(category._id.toString(), {
				name: category.name[defaultLocale],
			});

			await delay(2000);
		}

		return {
			success: true,
			message: `Successfully translated all categories (${categories.length})`,
		};
	}

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
	@UseInterceptors(FileInterceptor("imgFile"))
	async create(
		@Body() { name, parent, slug, sortOrder }: CreateCategoryDto,
		@UploadedFile() imgFile?: Express.Multer.File,
	) {
		let imgUrl: string | undefined;

		if (imgFile) {
			imgUrl = await this.cloudinaryService.uploadFile(imgFile);
		}

		return this.categoriesService.create({
			name,
			parent,
			slug,
			sortOrder,
			imgUrl,
		});
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update an existing category (admin)",
	})
	@UseInterceptors(FileInterceptor("imgFile"))
	async update(
		@Param("id") id: string,
		@Body() { name, parent, slug, sortOrder, isActive }: UpdateCategoryDto,
		@UploadedFile() imgFile?: Express.Multer.File,
	) {
		let imgUrl: string | undefined;

		if (imgFile !== undefined) {
			imgUrl = await this.cloudinaryService.uploadFile(imgFile);
		} else if (imgFile === null) {
			imgUrl = "";
		}

		return this.categoriesService.findByIdAndUpdate(id, {
			name,
			parent,
			slug,
			sortOrder,
			imgUrl,
			isActive,
		});
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Deactivate an existing category (admin)",
	})
	async delete(@Param("id") id: string) {
		return this.categoriesService.findByIdAndUpdate(id, { isActive: false });
	}
}
