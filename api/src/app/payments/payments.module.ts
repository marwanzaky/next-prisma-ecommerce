import { Module } from "@nestjs/common";

import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";
import { StripeService } from "@/services/stripe/stripe.service";

import { PrismaService } from "@/prisma.service";

import { PaymentsController } from "./payments.controller";

@Module({
	imports: [CloudinaryModule],
	controllers: [PaymentsController],
	providers: [StripeService, PrismaService],
})
export class PaymentsModule {}
