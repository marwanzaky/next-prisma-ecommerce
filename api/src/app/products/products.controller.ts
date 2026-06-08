import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation } from "@nestjs/swagger";

import {
	ProductWithVariantsReviewsUser,
	productWithVariantsReviewsUser,
} from "@repo/database";

import { Public } from "@/app/auth/auth.guard";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

import { CreateProductDto } from "./dto/create-product.dto";
import { GetAllProductsDto } from "./dto/get-all-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateProductVariantDto } from "./dto/update-product-variant.dto";

import { ProductsService } from "./products.service";

@Controller("products")
@ApiBearerAuth("Authorization")
export class ProductsController {
	constructor(
		private readonly prisma: PrismaService,
		private readonly productsService: ProductsService,
	) {}

	@Post("admin/recalculate-ratings")
	@Public()
	@ApiOperation({
		summary: "Recalculate all product avgRatings and ratingDistribution",
	})
	async recalculateAllRatings() {
		const products = await this.prisma.product.findMany();

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
	find(
		@Query() getAllProductsDto: GetAllProductsDto,
	): Promise<ProductWithVariantsReviewsUser[]> {
		return this.productsService.findMany(getAllProductsDto);
	}

	@Post()
	@ApiOperation({
		summary: "Create a new product",
	})
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("imgFiles", 10))
	create(
		@Req() req: AuthenticatedRequest,
		@Body()
		createProductDto: CreateProductDto,
		@UploadedFiles() imgFiles: Express.Multer.File[],
	): Promise<ProductWithVariantsReviewsUser | null> {
		if (createProductDto.variants) {
			const hasVariants = createProductDto.variants.length > 1;

			if (!hasVariants) {
				return this.productsService.create(req.user.id, {
					...createProductDto,
					variants: [
						{
							...createProductDto.variants[0],
							newImgIndices: createProductDto.newImgIndices,
							imgFiles,
						},
					],
				});
			}
		}

		return this.productsService.create(req.user.id, createProductDto);
	}

	@Get(":id")
	@Public()
	@ApiOperation({
		summary: "Get a single product by id",
	})
	findById(
		@Param("id") id: string,
	): Promise<ProductWithVariantsReviewsUser | null> {
		return this.prisma.product.findUnique({
			where: { id },
			...productWithVariantsReviewsUser,
		});
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Patch a product",
	})
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("imgFiles", 10))
	update(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: string,
		@Body()
		updateProductDto: UpdateProductDto,
		@UploadedFiles() imgFiles: Express.Multer.File[],
	) {
		if (updateProductDto.variants) {
			const hasVariants = updateProductDto.variants.length > 1;

			if (!hasVariants) {
				return this.productsService.update(id, req.user.id, {
					...updateProductDto,
					variants: [
						{
							...updateProductDto.variants[0],
							newImgIndices: updateProductDto.newImgIndices,
							imgFiles,
						},
					],
				});
			}
		}

		return this.productsService.update(id, req.user.id, updateProductDto);
	}

	@Patch(":id/variants/:variantId")
	@ApiOperation({
		summary: "Update a product variant",
	})
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FilesInterceptor("imgFiles", 10))
	updateVariant(
		@Req() req: AuthenticatedRequest,
		@Param("id") id: string,
		@Param("variantId") variantId: string,
		@Body()
		updateProductVariantDto: UpdateProductVariantDto,
		@UploadedFiles() imgFiles: Express.Multer.File[],
	): Promise<ProductWithVariantsReviewsUser | null> {
		return this.productsService.updateVariant(
			id,
			variantId,
			req.user.id,
			updateProductVariantDto,
			imgFiles,
		);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Delete a product",
	})
	deleteProduct(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
		return this.productsService.delete(id, req.user.id);
	}
}
