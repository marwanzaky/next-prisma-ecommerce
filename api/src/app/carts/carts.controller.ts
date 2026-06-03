import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { cartWithItems, CartWithItems } from "@repo/database";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

import { CreateCartItemDto } from "./dto/create-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Controller("carts")
@ApiBearerAuth("Authorization")
export class CartsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	@ApiOperation({
		summary: "Get the current user's cart",
	})
	async getCartMe(
		@Req() request: AuthenticatedRequest,
	): Promise<CartWithItems | null> {
		let cart = await this.prisma.cart.findFirst({
			where: {
				userId: request.user.id,
			},
			...cartWithItems,
		});

		if (!cart) {
			cart = await this.prisma.cart.create({
				data: {
					userId: request.user.id,
				},
				...cartWithItems,
			});
		}

		return cart;
	}

	@Post("items/:productVariantId")
	@ApiOperation({
		summary: "Add a product to the user's cart",
	})
	async createCartItem(
		@Req() req: AuthenticatedRequest,
		@Param("productVariantId") productVariantId: string,
		@Body() { quantity }: CreateCartItemDto,
	): Promise<CartWithItems | null> {
		const cart = await this.prisma.cart.upsert({
			where: { userId: req.user.id },
			update: {},
			create: { userId: req.user.id },
		});

		return await this.prisma.cart.upsert({
			where: {
				userId: req.user.id,
			},
			update: {
				items: {
					upsert: {
						where: {
							cartId_variantId: {
								cartId: cart.id,
								variantId: productVariantId,
							},
						},
						update: {
							quantity: { increment: quantity },
						},
						create: {
							variantId: productVariantId,
							quantity,
						},
					},
				},
			},
			create: {
				userId: req.user.id,
				items: {
					create: {
						variantId: productVariantId,
						quantity,
					},
				},
			},
			...cartWithItems,
		});
	}

	@Patch("items/:productVariantId/quantity")
	@ApiOperation({
		summary: "Update quantity of a product in the user's cart",
	})
	async updateCartItemQuantity(
		@Req() req: AuthenticatedRequest,
		@Param("productVariantId") productVariantId: string,
		@Body() { quantity }: UpdateCartItemDto,
	): Promise<CartWithItems | null> {
		return await this.prisma.cart.update({
			where: { userId: req.user.id },
			data: {
				items: {
					updateMany: {
						where: { variantId: productVariantId },
						data: { quantity },
					},
				},
			},
			...cartWithItems,
		});
	}

	@Delete("items/:productVariantId")
	@ApiOperation({
		summary: "Remove a product from the user's cart",
	})
	async deleteCartItem(
		@Req() req: AuthenticatedRequest,
		@Param("productVariantId") productVariantId: string,
	): Promise<CartWithItems | null> {
		return await this.prisma.cart.update({
			where: {
				userId: req.user.id,
			},
			data: {
				items: {
					deleteMany: {
						variantId: productVariantId,
					},
				},
			},
			...cartWithItems,
		});
	}
}
