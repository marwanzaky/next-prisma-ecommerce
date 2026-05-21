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

import { TranslatedText } from "@repo/types";

import { CloudinaryService } from "@/services/cloudinary/cloudinary.service";
import { TranslationService } from "@/services/translation/translation.service";

import { Roles } from "@/decorators/roles.decorator";
import { PrismaService } from "@/prisma.service";

import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("admin/categories")
@ApiTags("Admin Categories")
export class AdminCategoriesController {
	constructor(
		private cloudinaryService: CloudinaryService,
		private prisma: PrismaService,
		private translationService: TranslationService,
	) {}

	// @Get("admin/retranslate")
	// @Roles("admin")
	// @ApiOperation({
	// 	summary: "Get all categories (admin)",
	// })
	// @Public()
	// async translate() {
	// 	const defaultLocale = process.env.DEFAULT_LOCALE as Locale;
	// 	const categories = await this.prisma.category.findMany();

	// 	for (const category of categories) {
	// 		await this.categoriesService.findByIdAndUpdate(category._id.toString(), {
	// 			name: category.name[defaultLocale],
	// 		});

	// 		await delay(2000);
	// 	}

	// 	return {
	// 		success: true,
	// 		message: `Successfully translated all categories (${categories.length})`,
	// 	};
	// }

	@Get()
	@Roles("admin")
	@ApiOperation({
		summary: "Get all categories (admin)",
	})
	async getAllCategories() {
		return this.prisma.category.findMany({
			orderBy: {
				createdAt: "asc",
			},
		});
	}

	@Post()
	@Roles("admin")
	@ApiOperation({
		summary: "Create new category (admin)",
	})
	@UseInterceptors(FileInterceptor("imgFile"))
	async create(
		@Body() { name, parentId, slug, sortOrder }: CreateCategoryDto,
		@UploadedFile() imgFile?: Express.Multer.File,
	) {
		let imgUrl: string | undefined;

		if (imgFile) {
			imgUrl = await this.cloudinaryService.uploadFile(imgFile);
		}

		const translatedName = await this.translationService.translateText(name);

		return this.prisma.category.create({
			data: {
				name: translatedName,
				parentId,
				slug,
				sortOrder,
				imgUrl,
			},
		});
	}

	@Patch(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Update an existing category (admin)",
	})
	@UseInterceptors(FileInterceptor("imgFile"))
	async update(
		@Param("id") id: string,
		@Body() { name, parentId, slug, sortOrder, isActive }: UpdateCategoryDto,
		@UploadedFile() imgFile?: Express.Multer.File,
	) {
		let imgUrl: string | null | undefined;

		if (imgFile !== undefined) {
			imgUrl = await this.cloudinaryService.uploadFile(imgFile);
		} else if (imgFile === null) {
			imgUrl = null;
		}

		let translatedName: TranslatedText | undefined;

		if (name) {
			translatedName = await this.translationService.translateText(name);
		}

		return this.prisma.category.update({
			where: { id },
			data: {
				name: translatedName,
				slug,
				sortOrder,
				isActive,
				parentId,
				imgUrl,
			},
		});
	}

	@Delete(":id")
	@Roles("admin")
	@ApiOperation({
		summary: "Deactivate an existing category (admin)",
	})
	async delete(@Param("id") id: string) {
		return this.prisma.category.update({
			where: { id },
			data: { isActive: false },
		});
	}
}
