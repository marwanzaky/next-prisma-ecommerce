import { Prisma } from "../../generated/prisma/client";

export const orderWithItems = {
	include: {
		items: true,
	},
} satisfies Prisma.OrderDefaultArgs;

export type OrderWithItems = Prisma.OrderGetPayload<typeof orderWithItems>;
