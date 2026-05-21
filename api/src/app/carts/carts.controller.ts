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

import { CartWithItems } from "@repo/database";

import { PrismaService } from "@/prisma.service";
import { IRequest } from "@/types/request.type";

import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";

@Controller("carts")
@ApiBearerAuth("Authorization")
export class CartsController {
	constructor(private prisma: PrismaService) {}

	@Get()
	@ApiOperation({
		summary: "Get the current user's cart",
	})
	getMe(@Req() request: IRequest): Promise<CartWithItems | null> {
		return this.prisma.cart.findFirst({
			where: {
				userId: request.user.id,
			},
			include: {
				items: {
					orderBy: {
						createdAt: "asc",
					},
					include: {
						product: true,
					},
				},
			},
		});
	}

	@Post("items/:productId")
	@ApiOperation({
		summary: "Add a product to the user's cart",
	})
	async createCartItem(
		@Req() req: IRequest,
		@Param("productId") productId: string,
		@Body() { quantity }: AddCartItemDto,
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
							cartId_productId: {
								cartId: cart.id,
								productId,
							},
						},
						update: {
							quantity: { increment: quantity },
						},
						create: {
							productId,
							quantity,
						},
					},
				},
			},
			create: {
				userId: req.user.id,
				items: {
					create: {
						productId,
						quantity,
					},
				},
			},
			include: {
				items: {
					orderBy: {
						createdAt: "asc",
					},
					include: {
						product: true,
					},
				},
			},
		});
	}

	@Patch("items/:productId/quantity")
	@ApiOperation({
		summary: "Update quantity of a product in the user's cart",
	})
	async updateCartItemQuantity(
		@Req() req: IRequest,
		@Param("productId") productId: string,
		@Body() { quantity }: UpdateCartItemDto,
	): Promise<CartWithItems | null> {
		return await this.prisma.cart.update({
			where: { userId: req.user.id },
			data: {
				items: {
					updateMany: {
						where: { productId },
						data: { quantity },
					},
				},
			},
			include: {
				items: {
					orderBy: {
						createdAt: "asc",
					},
					include: { product: true },
				},
			},
		});
	}

	@Delete("items/:productId")
	@ApiOperation({
		summary: "Remove a product from the user's cart",
	})
	async deleteCartItem(
		@Req() req: IRequest,
		@Param("productId") productId: string,
	): Promise<CartWithItems | null> {
		return await this.prisma.cart.update({
			where: {
				userId: req.user.id,
			},
			data: {
				items: {
					deleteMany: {
						productId,
					},
				},
			},
			include: {
				items: {
					orderBy: {
						createdAt: "asc",
					},
					include: {
						product: true,
					},
				},
			},
		});
	}
}
