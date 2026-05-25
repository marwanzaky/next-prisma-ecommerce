import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { Locale, TranslatedText } from "@repo/types";

import { TranslationService } from "@/services/translation/translation.service";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

import { CreateProductReviewDto } from "./dto/create-product-review.dto";
import { UpdateProductReviewDto } from "./dto/update-product-review.dto";

import { ProductsService } from "../products/products.service";

@Controller("products/:id/reviews")
@ApiBearerAuth("Authorization")
export class ReviewsController {
	private defaultLocale: Locale;

	constructor(
		private prisma: PrismaService,
		private translationService: TranslationService,
		private productsService: ProductsService,
	) {
		this.defaultLocale = process.env.DEFAULT_LOCALE as Locale;
	}

	@Get()
	@ApiOperation({
		summary: "Get all reviews for a product",
	})
	async findMany(@Param("id") productId: string) {
		return this.prisma.review.findMany({
			where: {
				productId,
			},
		});
	}

	@Post()
	@ApiOperation({
		summary: "Add a review for a product",
	})
	async create(
		@Req() req: AuthenticatedRequest,
		@Param("id") productId: string,
		@Body() { rating, description }: CreateProductReviewDto,
	) {
		const existingReview = await this.prisma.review.findFirst({
			where: {
				userId: req.user.id,
				productId,
			},
		});

		if (existingReview) {
			throw new BadRequestException(
				"User already left review for this product",
			);
		}

		let translatedDescription: TranslatedText | undefined = undefined;
		if (description) {
			translatedDescription =
				await this.translationService.translateText(description);
		}

		const review = await this.prisma.review.create({
			data: {
				rating,
				description: translatedDescription,
				productId,
				userId: req.user.id,
			},
		});

		await this.productsService.calcAvgRatings(productId);
		await this.productsService.calcRatingDistribution(productId);

		return review;
	}

	@Patch()
	@ApiOperation({
		summary: "Update review for a product",
	})
	async update(
		@Req() req: AuthenticatedRequest,
		@Param("id") productId: string,
		@Body() { rating, description }: UpdateProductReviewDto,
	) {
		const currentReview = await this.prisma.review.findUnique({
			where: {
				userId_productId: {
					userId: req.user.id,
					productId,
				},
			},
		});

		if (!currentReview) {
			throw new BadRequestException(
				"User does not have a review yet this product",
			);
		}

		let translatedDescription: TranslatedText | undefined = undefined;
		if (
			description &&
			description !==
				(currentReview.description as TranslatedText)?.[this.defaultLocale]
		) {
			translatedDescription =
				await this.translationService.translateText(description);
		}

		const review = await this.prisma.review.update({
			where: {
				userId_productId: {
					userId: req.user.id,
					productId,
				},
			},
			data: {
				rating,
				description: translatedDescription,
			},
		});

		await this.productsService.calcAvgRatings(productId);
		await this.productsService.calcRatingDistribution(productId);

		return review;
	}
}
