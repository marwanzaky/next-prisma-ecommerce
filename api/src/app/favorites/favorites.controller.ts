import { Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import {
	Product,
	productWithVariantsReviewsUser,
	ProductWithVariantsReviewsUser,
} from "@repo/database";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

import { CreateFavoriteDto } from "./dto/create-favorite.dto";

@Controller("favorites")
@ApiBearerAuth("Authorization")
export class FavoritesController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	@ApiOperation({
		summary: "Get all favorite products",
	})
	async getMe(
		@Req() request: AuthenticatedRequest,
	): Promise<ProductWithVariantsReviewsUser[]> {
		const favorites = await this.prisma.favorite.findMany({
			where: {
				userId: request.user.id,
			},
			include: {
				product: {
					...productWithVariantsReviewsUser,
				},
			},
		});

		return favorites.map((favorite) => favorite.product);
	}

	@Post("/:productId")
	@ApiOperation({
		summary: "Add a product to favorites",
	})
	async create(
		@Req() request: AuthenticatedRequest,
		@Param() { productId }: CreateFavoriteDto,
	): Promise<ProductWithVariantsReviewsUser> {
		const favorite = await this.prisma.favorite.upsert({
			where: {
				userId_productId: {
					userId: request.user.id,
					productId,
				},
			},
			update: {},
			create: {
				userId: request.user.id,
				productId,
			},
			include: {
				product: {
					...productWithVariantsReviewsUser,
				},
			},
		});

		return favorite.product;
	}

	@Delete("/:productId")
	@ApiOperation({
		summary: "Remove a product from favorites",
	})
	async remove(
		@Param("productId") productId: string,
		@Req() request: AuthenticatedRequest,
	): Promise<Product> {
		const favorite = await this.prisma.favorite.delete({
			where: {
				userId_productId: {
					userId: request.user.id,
					productId,
				},
			},
			include: { product: true },
		});

		return favorite.product;
	}
}
