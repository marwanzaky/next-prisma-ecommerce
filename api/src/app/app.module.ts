import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { PrismaService } from "@/prisma.service";

import { AdminCategoriesModule } from "./admin/admin-categories/admin-categories.module";
import { ContactMessagesModule } from "./admin/contact-messages/contact-messages.module";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { CartsModule } from "./carts/carts.module";
import { CategoriesModule } from "./categories/categories.module";
import { ChatModule } from "./chat/chat.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { OrdersModule } from "./orders/orders.module";
import { PaymentsModule } from "./payments/payments.module";
import { ProductsModule } from "./products/products.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { UploadsModule } from "./uploads/uploads.module";
import { UsersModule } from "./users/users.module";
import { WebhooksModule } from "./webhooks/webhooks.module";

import { RolesGuard } from "../guards/roles.guard";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ".env",
			isGlobal: true,
		}),

		AuthModule,
		UsersModule,
		ProductsModule,
		ReviewsModule,
		CartsModule,
		FavoritesModule,
		PaymentsModule,
		ContactMessagesModule,
		ChatModule,
		UploadsModule,
		AdminCategoriesModule,
		CategoriesModule,
		OrdersModule,
		WebhooksModule,
	],
	providers: [
		JwtService,
		PrismaService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}
