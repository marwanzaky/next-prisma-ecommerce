import { OrderWithItems } from "@repo/database";

import { clientFetch } from "@/lib/api-client";

export const ordersService = {
	myOrders: () => clientFetch<OrderWithItems[]>("/orders/my-orders"),
	myOrder: (orderId: string) =>
		clientFetch<OrderWithItems | null>("/orders/my-orders/" + orderId),
};
