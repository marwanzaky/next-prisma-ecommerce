import { Prisma } from "../../generated/prisma/client";

const cartWithItems = {
	include: {
		items: {
			include: {
				product: true,
			},
		},
	},
} satisfies Prisma.CartDefaultArgs;

export type CartWithItems = Prisma.CartGetPayload<typeof cartWithItems>;

const cartItemWithProduct = {
	include: {
		product: true,
	},
} satisfies Prisma.CartItemDefaultArgs;

export type CartItemWithProduct = Prisma.CartItemGetPayload<
	typeof cartItemWithProduct
>;
