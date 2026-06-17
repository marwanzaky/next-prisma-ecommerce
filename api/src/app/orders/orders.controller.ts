import { Controller, Get, Param, Req } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { OrderWithItems, orderWithItems } from "@repo/database";

import { PrismaService } from "@/prisma.service";
import { AuthenticatedRequest } from "@/types/request.type";

@Controller("orders")
@ApiBearerAuth("Authorization")
export class OrdersController {
	constructor(private prisma: PrismaService) {}

	@Get("my-orders")
	async getMyOrders(
		@Req() req: AuthenticatedRequest,
	): Promise<OrderWithItems[]> {
		return this.prisma.order.findMany({
			where: {
				userId: req.user.id,
				status: { in: ["PAID", "CANCELLED", "REFUNDED"] },
			},
			orderBy: {
				createdAt: "desc",
			},
			...orderWithItems,
		});
	}

	@Get("my-orders/:orderId")
	async getMyOrder(
		@Req() req: AuthenticatedRequest,
		@Param("orderId") orderId: string,
	): Promise<OrderWithItems | null> {
		return this.prisma.order.findUnique({
			where: {
				userId: req.user.id,
				status: { in: ["PAID", "CANCELLED", "REFUNDED"] },
				id: orderId,
			},
			...orderWithItems,
		});
	}
}
