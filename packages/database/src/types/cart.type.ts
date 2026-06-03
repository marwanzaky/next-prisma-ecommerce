import { Prisma } from "../../generated/prisma/client";

export const cartWithItems = {
	include: {
		items: {
			orderBy: {
				createdAt: "asc",
			},
			include: {
				variant: {
					include: {
						product: true,
					},
				},
			},
		},
	},
} satisfies Prisma.CartDefaultArgs;

export type CartWithItems = Prisma.CartGetPayload<typeof cartWithItems>;

export const cartItemWithProductVariant = {
	include: {
		variant: {
			include: {
				product: true,
			},
		},
	},
} satisfies Prisma.CartItemDefaultArgs;

export type CartItemWithProductVariant = Prisma.CartItemGetPayload<
	typeof cartItemWithProductVariant
>;
