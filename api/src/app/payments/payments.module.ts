import { Module } from "@nestjs/common";

import { CloudinaryModule } from "@/services/cloudinary/cloudinary.module";

import { PrismaService } from "@/prisma.service";

import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
	imports: [CloudinaryModule],
	controllers: [PaymentsController],
	providers: [PaymentsService, PrismaService],
})
export class PaymentsModule {}
