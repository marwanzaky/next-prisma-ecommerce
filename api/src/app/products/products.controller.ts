import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UnauthorizedException,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";

import { ProductWithReviewsAndUserRaw } from "@repo/database";
import { Prisma, Product } from "@repo/database";
import { Locale, TranslatedText } from "@repo/types";

import { Public } from "@/app/auth/auth.guard";

import { CategoriesService } from "@/services/categories/categories.service";
import { CloudinaryService } from "@/services/cloudinary/cloudinary.service";
import { TranslationService } from "@/services/translation/translation.service";

import { PrismaService } from "@/prisma.service";
import { IRequest } from "@/types/request.type";

import { CreateProductDto } from "./dto/create-product.dto";
import { GetAllProductsDto } from "./dto/get-all-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

import { ProductsService } from "./products.service";

@Controller("products")
@ApiBearerAuth("Authorization")
export class ProductsController {
	private defaultLocale: Locale;

	constructor(
		private readonly prisma: PrismaService,
		private readonly categoriesService: CategoriesService,
		private readonly productsService: ProductsService,
		private readonly cloudinaryService: CloudinaryService,
		private readonly translationService: TranslationService,
	) {
		this.defaultLocale = process.env.DEFAULT_LOCALE as Locale;
	}

	@Post("admin/recalculate-ratings")
	@Public()
	@ApiOperation({
		summary: "Recalculate all product avgRatings and ratingDistribution",
	})
	async recalculateAllRatings() {
		const products = await this.productsService.find({});

		for (const product of products) {
			await this.productsService.calcAvgRatings(product.id);
			await this.productsService.calcRatingDistribution(product.id);
		}

		return {
			success: true,
			message: `Successfully recalculate all product "avgRatings" and "ratingDistribution" (${products.length})`,
		};
	}

	// @Post("admin/retranslate")
	// @Public()
	// async retranslate() {
	// 	const defaultLocale = process.env.DEFAULT_LOCALE as Locale;
	// 	const products = await this.productsService.find({});

	// 	for (const product of products) {
	// 		const updatedProduct: UpdateProductEntity = {
	// 			name: product.name[defaultLocale],
	// 			description: product.description[defaultLocale],
	// 			shortDescription: product.shortDescription?.[defaultLocale],
	// 		};

	// 		await this.productsService.findByIdAndUpdate(
	// 			product.id,
	// 			updatedProduct,
	// 		);
	// 	}

	// 	return {
	// 		success: true,
	// 		message: `Successfully translated all products (${products.length})`,
	// 	};
	// }

	@Get()
	@Public()
	@ApiOperation({
		summary: "Get all products",
	})
	async find(@Query() dto: GetAllProductsDto): Promise<Product[]> {
		const {
			sortProperty,
			sortOrder,
			name,
			excludeIds,
			minPrice,
			maxPrice,
			featured,
			isHero,
			limit,
			avgRatings,
			categoryId,
		} = dto;

		const where: Prisma.ProductWhereInput = {};

		let orderBy:
			| Prisma.ProductOrderByWithRelationInput
			| Prisma.ProductOrderByWithRelationInput[]
			| undefined;

		if (avgRatings !== undefined) {
			where.avgRatings = {
				gte: Number(avgRatings),
			};
		}

		if (name !== undefined) {
			where.OR = [
				{
					name: {
						path: ["en"],
						string_contains: name,
						mode: "insensitive",
					},
				},
				{
					name: {
						path: ["ar"],
						string_contains: name,
						mode: "insensitive",
					},
				},
				{
					name: {
						path: ["fr"],
						string_contains: name,
						mode: "insensitive",
					},
				},
			];
		}

		if (categoryId !== undefined) {
			where.categoryId = {
				in: await this.categoriesService.getAllDescendantCategoryIds(
					categoryId,
				),
			};
		}

		if (excludeIds !== undefined) {
			where.id = {
				notIn: excludeIds,
			};
		}

		if (avgRatings !== undefined) {
			where.avgRatings = {
				gte: avgRatings,
			};
		}

		if (minPrice !== undefined || maxPrice !== undefined) {
			where.price = {
				...(minPrice !== undefined && { gte: minPrice }),
				...(maxPrice !== undefined && { lte: maxPrice }),
			};
		}

		if (sortProperty) {
			orderBy = {
				[sortProperty]: sortOrder === "desc" ? "desc" : "asc",
			};
		}

		return this.prisma.product.findMany({
			where: {
				...where,
				featured,
				isHero,
			},
			orderBy,
			take: limit,
		});
	}

	@Post()
	@ApiOperation({
		summary: "Create a new product",
	})
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("imgFiles", 10))
	async create(
		@Req() req: IRequest,
		@Body()
		createProductDto: CreateProductDto,
		@UploadedFiles() imgFiles: Express.Multer.File[],
	): Promise<Product> {
		const {
			name,
			description,
			shortDescription,
			price,
			priceCompare,
			stock,
			tags,
			categoryId,
		} = createProductDto;

		const translatedName = await this.translationService.translateText(name);
		const translatedDescription =
			await this.translationService.translateJson(description);

		let translatedShortDescription: TranslatedText | undefined = undefined;
		if (shortDescription) {
			translatedShortDescription =
				await this.translationService.translateJson(shortDescription);
		}

		const imgUrls = await Promise.all(
			imgFiles.map((file) => this.cloudinaryService.uploadFile(file)),
		);

		return this.prisma.product.create({
			data: {
				name: translatedName,
				description: translatedDescription,
				shortDescription: translatedShortDescription,
				price,
				priceCompare,
				ratingDistribution: {
					"1": 0,
					"2": 0,
					"3": 0,
					"4": 0,
					"5": 0,
				},
				stock,
				tags,
				imgUrls: imgUrls.filter((el) => el !== undefined),
				userId: req.user.id,
				categoryId,
			},
		});
	}

	@Get(":id")
	@Public()
	@ApiOperation({
		summary: "Get a single product by id",
	})
	async findById(
		@Param("id") id: string,
	): Promise<ProductWithReviewsAndUserRaw | null> {
		return this.prisma.product.findUnique({
			where: { id },
			include: {
				reviews: {
					include: {
						user: {
							select: {
								id: true,
								name: true,
								avatarUrl: true,
							},
						},
					},
				},
				user: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
						createdAt: true,
						updatedAt: true,
					},
				},
			},
		});
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Patch a product",
	})
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("imgFiles", 10))
	async patchProduct(
		@Req() req: IRequest,
		@Param("id") id: string,
		@Body()
		updateProductDto: UpdateProductDto,
		@UploadedFiles() imgFiles: Express.Multer.File[],
	) {
		const {
			name,
			description,
			shortDescription,
			price,
			priceCompare,
			stock,
			tags,
			categoryId,
			keptImgs,
			newImgIndices,
		} = updateProductDto;

		const existingProduct = await this.prisma.product.findUnique({
			where: { id },
		});

		if (!existingProduct) {
			throw new NotFoundException("Product not found");
		}

		if (existingProduct.userId !== req.user.id) {
			throw new UnauthorizedException("Not allowed");
		}

		if (newImgIndices && imgFiles.length !== newImgIndices.length) {
			throw new BadRequestException(
				"newImgIndices length must match imgFiles length",
			);
		}

		let translatedName: TranslatedText | undefined;
		if (
			name !== undefined &&
			(existingProduct.name as TranslatedText)[this.defaultLocale] !== name
		) {
			translatedName = await this.translationService.translateText(name);
		}

		let translatedDescription: TranslatedText | undefined;
		if (
			description !== undefined &&
			(existingProduct.description as TranslatedText)[this.defaultLocale] !==
				description
		) {
			translatedDescription =
				await this.translationService.translateJson(description);
		}

		let translatedShortDescription: TranslatedText | undefined;
		if (
			shortDescription !== undefined &&
			(existingProduct.shortDescription as TranslatedText)[
				this.defaultLocale
			] !== shortDescription
		) {
			translatedShortDescription =
				await this.translationService.translateJson(shortDescription);
		}

		const imgUrls =
			keptImgs || newImgIndices
				? await this.productsService.buildPatchedImgUrls(
						existingProduct.imgUrls,
						keptImgs,
						{
							imgFiles,
							newImgIndices: newImgIndices,
						},
					)
				: undefined;

		return this.prisma.product.update({
			where: { id },
			data: {
				name: translatedName,
				description: translatedDescription,
				shortDescription: translatedShortDescription,
				price,
				priceCompare,
				stock,
				tags,
				categoryId,
				imgUrls,
			},
		});
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Delete a product",
	})
	async deleteProduct(@Req() req: IRequest, @Param("id") id: string) {
		const existingProduct = await this.prisma.product.findUnique({
			where: { id },
		});

		if (!existingProduct) {
			throw new NotFoundException("Product not found");
		}

		if (existingProduct.userId !== req.user.id) {
			throw new UnauthorizedException("Not allowed");
		}

		return this.prisma.product.delete({ where: { id } });
	}
}
