import { Prisma } from "../../generated/prisma/client";

export const orderWithItems = {
	include: {
		items: true,
	},
} satisfies Prisma.OrderDefaultArgs;

export type OrderWithItems = Prisma.OrderGetPayload<typeof orderWithItems>;

export const orderItemWithVariant = {
	include: {
		variant: true,
	},
} satisfies Prisma.OrderItemDefaultArgs;

export type OrderItemWithVariant = Prisma.OrderItemGetPayload<
	typeof orderItemWithVariant
>;
